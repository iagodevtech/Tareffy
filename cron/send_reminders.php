<?php
require __DIR__ . '/../api/config.php';
$pdo = db();

// Select tasks due within next 24h and not past due
$st = $pdo->query("SELECT t.id, t.title, t.due_at, u.email, u.name FROM tasks t JOIN users u ON u.id=t.assignee_user_id WHERE t.due_at IS NOT NULL AND t.due_at >= NOW() AND t.due_at <= DATE_ADD(NOW(), INTERVAL 1 DAY) AND u.email_reminders=1");
$tasks = $st->fetchAll();

foreach($tasks as $t){
	$subject = 'Lembrete de tarefa: ' . $t['title'];
	$message = '<p>Olá ' . htmlspecialchars($t['name']) . ',</p>' .
		'<p>Sua tarefa <strong>' . htmlspecialchars($t['title']) . '</strong> vence em ' . date('d/m/Y H:i', strtotime($t['due_at'])) . '.</p>' .
		'<p>Acesse o TaskFlow para mais detalhes.</p>';
	send_mail($t['email'], $subject, $message);
}

echo json_encode(['sent' => count($tasks)]);