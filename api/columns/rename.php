<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$body = json_body();
$id = (int)($body['id'] ?? 0);
$name = trim($body['name'] ?? '');
if(!$id || !$name) fail(400,'Dados inválidos');

// ensure user has access to board via column and get board id
$st = $pdo->prepare('SELECT c.board_id FROM columns c JOIN boards b ON b.id=c.board_id JOIN teams t ON t.id=b.team_id JOIN team_members m ON m.team_id=t.id WHERE c.id=? AND m.user_id=?');
$st->execute([$id,$user['id']]);
$row = $st->fetch();
if(!$row) fail(403,'Sem acesso');
$boardId = (int)$row['board_id'];

$st = $pdo->prepare('UPDATE columns SET name=? WHERE id=?');
$st->execute([$name,$id]);

broadcast_event('board-'.$boardId, 'board_update', ['type'=>'column_renamed','id'=>$id]);

ok(['ok'=>true]);