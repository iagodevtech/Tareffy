<?php
declare(strict_types=1);

session_start();

$envPath = __DIR__ . '/../.env.php';
if (!file_exists($envPath)) {
	http_response_code(500);
	echo json_encode(['error' => 'Env file missing']);
	exit;
}
$config = require $envPath;

header('Content-Type: application/json; charset=utf-8');

// Basic CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $config['CORS_ORIGINS'] ?? [], true)) {
	header('Access-Control-Allow-Origin: ' . $origin);
	header('Vary: Origin');
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Headers: Content-Type');
	header('Access-Control-Allow-Methods: GET,POST,OPTIONS');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
	exit; // preflight
}

function db(): PDO {
	static $pdo = null;
	global $config;
	if ($pdo) return $pdo;
	$dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $config['DB_HOST'], $config['DB_NAME'], $config['DB_CHARSET']);
	$pdo = new PDO($dsn, $config['DB_USER'], $config['DB_PASS'], [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	]);
	return $pdo;
}

function json_body(): array {
	$raw = file_get_contents('php://input');
	if (!$raw) return [];
	$data = json_decode($raw, true);
	return is_array($data) ? $data : [];
}

function ok($data = []) { echo json_encode($data); exit; }
function fail(int $code, string $message) { http_response_code($code); echo json_encode(['error'=>$message]); exit; }

function require_auth(): array {
	if (!isset($_SESSION['user'])) fail(401, 'Não autenticado');
	return $_SESSION['user'];
}

function send_mail(string $to, string $subject, string $message): bool {
	global $config;
	$headers = [];
	$headers[] = 'MIME-Version: 1.0';
	$headers[] = 'Content-type: text/html; charset=UTF-8';
	$headers[] = 'From: ' . ($config['EMAIL_FROM_NAME'] ?? 'TaskFlow') . ' <' . ($config['EMAIL_FROM'] ?? 'no-reply@example.com') . '>';
	return mail($to, $subject, $message, implode("\r\n", $headers));
}

// Pusher broadcast (optional). If not configured, it silently returns.
function broadcast_event(string $channel, string $event, array $data): void {
	global $config;
	$appId = trim((string)($config['PUSHER_APP_ID'] ?? ''));
	$key = trim((string)($config['PUSHER_KEY'] ?? ''));
	$secret = trim((string)($config['PUSHER_SECRET'] ?? ''));
	$cluster = trim((string)($config['PUSHER_CLUSTER'] ?? ''));
	if ($appId === '' || $key === '' || $secret === '' || $cluster === '') return;

	$body = json_encode(['name'=>$event, 'channels'=>[$channel], 'data'=>json_encode($data)], JSON_UNESCAPED_UNICODE);
	$bodyMd5 = md5($body);
	$path = "/apps/{$appId}/events";
	$query = [
		'auth_key' => $key,
		'auth_timestamp' => (string)time(),
		'auth_version' => '1.0',
		'body_md5' => $bodyMd5,
	];
	ksort($query);
	$queryString = http_build_query($query);
	$stringToSign = "POST\n{$path}\n{$queryString}";
	$signature = hash_hmac('sha256', $stringToSign, $secret);
	$url = "https://api-{$cluster}.pusher.com{$path}?{$queryString}&auth_signature={$signature}";

	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_TIMEOUT, 2);
	curl_exec($ch);
	curl_close($ch);
}