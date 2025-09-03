<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();
$body = json_body();
$allowBrowser = !empty($body['allowBrowser']) ? 1 : 0;
$emailReminders = !empty($body['emailReminders']) ? 1 : 0;
$st = $pdo->prepare('UPDATE users SET allow_browser_notif=?, email_reminders=? WHERE id=?');
$st->execute([$allowBrowser,$emailReminders,$user['id']]);
ok(['ok'=>true]);