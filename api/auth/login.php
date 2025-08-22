<?php
require __DIR__ . '/../config.php';

$body = json_body();
$email = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';
if (!$email || !$password) fail(400, 'Dados inválidos');

$pdo = db();
$st = $pdo->prepare('SELECT id,name,email,password_hash FROM users WHERE email = ? LIMIT 1');
$st->execute([$email]);
$user = $st->fetch();
if (!$user || !password_verify($password, $user['password_hash'])) fail(401, 'Credenciais inválidas');

$_SESSION['user'] = ['id'=>$user['id'],'name'=>$user['name'],'email'=>$user['email']];
ok(['user'=>$_SESSION['user']]);