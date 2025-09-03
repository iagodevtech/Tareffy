<?php
require __DIR__ . '/../config.php';

$body = json_body();
$name = trim($body['name'] ?? '');
$email = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';
if (!$name || !$email || !$password) fail(400, 'Dados inválidos');

$pdo = db();
$st = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$st->execute([$email]);
if ($st->fetch()) fail(409, 'E-mail já cadastrado');

$hash = password_hash($password, PASSWORD_DEFAULT);
$st = $pdo->prepare('INSERT INTO users(name,email,password_hash) VALUES(?,?,?)');
$st->execute([$name,$email,$hash]);

ok(['ok'=>true]);