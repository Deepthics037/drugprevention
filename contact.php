<?php 
header('Content-Type: application/json');
require_once 'db.php';

$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone   = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if(!$name || !$email || !$message){
    echo json_encode(['success'=>false,'message'=>'Please fill required fields']);
    exit;
}

try{
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO contacts (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $phone, $message]);

    echo json_encode(['success'=>true,'message'=>'Thank you — we will contact you soon.']);
}
catch(Exception $e){
    echo json_encode(['success'=>false,'message'=>'Server error: '.$e->getMessage()]);
}
?>
