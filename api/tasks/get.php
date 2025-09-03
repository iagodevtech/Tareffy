<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$id = (int)($_GET['id'] ?? 0);
if(!$id) fail(400,'ID inválido');

$st = $pdo->prepare('SELECT t.*, c.name AS column_name, u.name AS assignee_name FROM tasks t JOIN columns c ON c.id=t.column_id LEFT JOIN users u ON u.id=t.assignee_user_id WHERE t.id=?');
$st->execute([$id]);
$task = $st->fetch();
if(!$task) fail(404,'Tarefa não encontrada');

// access check
$st = $pdo->prepare('SELECT 1 FROM boards b JOIN teams t ON t.id=b.team_id JOIN team_members m ON m.team_id=t.id WHERE b.id=? AND m.user_id=?');
$st->execute([$task['board_id'],$user['id']]);
if(!$st->fetch()) fail(403,'Sem acesso');

ok(['task'=>$task]);