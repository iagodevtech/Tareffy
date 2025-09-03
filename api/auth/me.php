<?php
require __DIR__ . '/../config.php';

if (!isset($_SESSION['user'])) ok(['user'=>null]);
ok(['user'=>$_SESSION['user']]);