<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$body = json_body();
$taskId = (int)($body['taskId'] ?? 0);
$toColumnId = (int)($body['toColumnId'] ?? 0);
if(!$taskId || !$toColumnId) fail(400,'Dados inválidos');

$st = $pdo->prepare('SELECT t.*, c.board_id FROM tasks t JOIN columns c ON c.id=t.column_id WHERE t.id=?');
$st->execute([$taskId]);
$task = $st->fetch();
if(!$task) fail(404,'Tarefa não encontrada');

// check access for user on board
$st = $pdo->prepare('SELECT 1 FROM boards b JOIN teams t ON t.id=b.team_id JOIN team_members m ON m.team_id=t.id WHERE b.id=? AND m.user_id=?');
$st->execute([$task['board_id'],$user['id']]);
if(!$st->fetch()) fail(403,'Sem acesso');

// ensure target column belongs to same board
$st = $pdo->prepare('SELECT name, board_id FROM columns WHERE id=?');
$st->execute([$toColumnId]);
$col = $st->fetch();
if(!$col || (int)$col['board_id'] !== (int)$task['board_id']) fail(400,'Coluna inválida');

$st = $pdo->prepare('UPDATE tasks SET column_id=? WHERE id=?');
$st->execute([$toColumnId,$taskId]);

// notify assignee
if(!empty($task['assignee_user_id'])){
	$st = $pdo->prepare('INSERT INTO notifications(user_id,message) VALUES(?,?)');
	$st->execute([$task['assignee_user_id'], 'Tarefa "'.$task['title'].'" movida para "'.$col['name'].'"']);
}

ok(['ok'=>true]);