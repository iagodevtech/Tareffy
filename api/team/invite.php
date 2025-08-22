<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$body = json_body();
$email = strtolower(trim($body['email'] ?? ''));
if(!$email) fail(400,'E-mail inválido');

// find a team the user owns or belongs to
$st = $pdo->prepare('SELECT t.* FROM teams t JOIN team_members m ON m.team_id=t.id WHERE m.user_id=? ORDER BY t.id LIMIT 1');
$st->execute([$user['id']]);
$team = $st->fetch();
if(!$team) fail(404,'Nenhum time disponível');

$inviteUrl = ($config['APP_URL'] ?? '') . '/#/register';
$message = '<p>Você foi convidado para a equipe "'.htmlspecialchars($team['name']).'" no TaskFlow.</p>' .
	'<p>Crie sua conta aqui: <a href="'.htmlspecialchars($inviteUrl).'">'.htmlspecialchars($inviteUrl).'</a></p>';

send_mail($email, 'Convite para equipe', $message);
ok(['ok'=>true]);