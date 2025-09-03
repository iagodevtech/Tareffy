<?php
require __DIR__ . '/../config.php';
$user = require_auth();
$pdo = db();

// Find a board for user via team membership
$board = null;
$st = $pdo->prepare("SELECT b.* FROM boards b JOIN teams t ON b.team_id=t.id JOIN team_members m ON m.team_id=t.id WHERE m.user_id=? LIMIT 1");
$st->execute([$user['id']]);
$board = $st->fetch();

if (!$board) {
	$pdo->beginTransaction();
	try {
		// create personal team
		$st = $pdo->prepare('INSERT INTO teams(name, owner_user_id) VALUES(?,?)');
		$st->execute(['Equipe de ' . $user['name'], $user['id']]);
		$teamId = (int)$pdo->lastInsertId();
		$st = $pdo->prepare('INSERT INTO team_members(team_id,user_id,role) VALUES(?,?,?)');
		$st->execute([$teamId, $user['id'], 'owner']);
		$st = $pdo->prepare('INSERT INTO boards(team_id,name) VALUES(?,?)');
		$st->execute([$teamId, 'Quadro']);
		$boardId = (int)$pdo->lastInsertId();
		$defaults = ['A Fazer','Em Progresso','Concluído'];
		$ord = 0;
		foreach($defaults as $name){
			$stc = $pdo->prepare('INSERT INTO columns(board_id,name,sort_order) VALUES(?,?,?)');
			$stc->execute([$boardId, $name, $ord++]);
		}
		$pdo->commit();
		$st = $pdo->prepare('SELECT * FROM boards WHERE id=?');
		$st->execute([$boardId]);
		$board = $st->fetch();
	} catch(Exception $e){ $pdo->rollBack(); fail(500, 'Falha ao criar board'); }
}

// Load columns
$st = $pdo->prepare('SELECT * FROM columns WHERE board_id=? ORDER BY sort_order ASC, id ASC');
$st->execute([$board['id']]);
$columns = $st->fetchAll();

// Load tasks grouped
$st = $pdo->prepare('SELECT t.*, u.name AS assignee_name, c.name AS column_name FROM tasks t LEFT JOIN users u ON u.id=t.assignee_user_id JOIN columns c ON c.id=t.column_id WHERE t.board_id=?');
$st->execute([$board['id']]);
$tasks = $st->fetchAll();
$tasksByColumn = [];
foreach($columns as $col){ $tasksByColumn[$col['id']] = []; }
foreach($tasks as $t){ $tasksByColumn[$t['column_id']][] = $t; }

ok(['board'=>$board,'columns'=>$columns,'tasksByColumn'=>$tasksByColumn]);