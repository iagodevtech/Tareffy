<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$body = json_body();
$title = trim($body['title'] ?? '');
$toColumnId = (int)($body['toColumnId'] ?? 0);
if(!$title || !$toColumnId) fail(400,'Dados inválidos');

// column access check and find board
$st = $pdo->prepare('SELECT c.board_id FROM columns c JOIN boards b ON b.id=c.board_id JOIN teams t ON t.id=b.team_id JOIN team_members m ON m.team_id=t.id WHERE c.id=? AND m.user_id=?');
$st->execute([$toColumnId,$user['id']]);
$row = $st->fetch();
if(!$row) fail(403,'Sem acesso');
$boardId = (int)$row['board_id'];

$st = $pdo->prepare('INSERT INTO tasks(board_id,column_id,title,created_by) VALUES(?,?,?,?)');
$st->execute([$boardId,$toColumnId,$title,$user['id']]);

broadcast_event('board-'.$boardId, 'board_update', ['type'=>'task_created']);

ok(['ok'=>true]);