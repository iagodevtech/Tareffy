<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$body = json_body();
$name = trim($body['name'] ?? '');
if (!$name) fail(400,'Nome obrigatório');

// find user's board
$st = $pdo->prepare("SELECT b.* FROM boards b JOIN teams t ON b.team_id=t.id JOIN team_members m ON m.team_id=t.id WHERE m.user_id=? LIMIT 1");
$st->execute([$user['id']]);
$board = $st->fetch();
if(!$board) fail(404,'Board não encontrado');

$st = $pdo->prepare('SELECT COALESCE(MAX(sort_order), -1)+1 AS next FROM columns WHERE board_id=?');
$st->execute([$board['id']]);
$next = (int)$st->fetch()['next'];

$st = $pdo->prepare('INSERT INTO columns(board_id,name,sort_order) VALUES(?,?,?)');
$st->execute([$board['id'],$name,$next]);

broadcast_event('board-'.$board['id'], 'board_update', ['type'=>'column_created']);

ok(['ok'=>true]);