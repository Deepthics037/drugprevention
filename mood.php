<?php 
header('Content-Type: application/json');
require_once 'db.php';

define('UPLOAD_DIR', __DIR__ . '/uploads');

$mood = isset($_POST['mood']) ? intval($_POST['mood']) : null;
$note = isset($_POST['note']) ? trim($_POST['note']) : '';
$ip   = $_SERVER['REMOTE_ADDR'] ?? '';

if ($mood === null) {
    echo json_encode(['success' => false, 'message' => 'No mood provided']);
    exit;
}

$image_path = null;

if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {

    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    $tmp = $_FILES['image']['tmp_name'];
    $fname = uniqid('mood_') . '.jpg';
    $dest = UPLOAD_DIR . '/' . $fname;

    if (move_uploaded_file($tmp, $dest)) {
        $image_path = 'uploads/' . $fname;
    } else {
        echo json_encode(['success'=>false,'message'=>'File upload failed']);
        exit;
    }
}

try {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO mood_logs (mood, note, image_path, ip, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$mood, $note, $image_path, $ip]);

    echo json_encode(['success'=>true,'message'=>'Mood logged successfully']);
} 
catch(Exception $e){
    echo json_encode(['success'=>false,'message'=>'DB error: '.$e->getMessage()]);
}
?>
