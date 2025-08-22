<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$st = $pdo->prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 50');
$st->execute([$user['id']]);
$items = $st->fetchAll();
ok(['notifications'=>$items]);