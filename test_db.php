<?php
require_once 'db.php';

try {
    $db = getDB();
    echo "DB Connected Successfully!";
} catch(Exception $e){
    echo "Error: " . $e->getMessage();
}
?>
