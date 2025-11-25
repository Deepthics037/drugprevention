<?php
header("Content-Type: application/json");

// Read user message
$input = json_decode(file_get_contents("php://input"), true);
$userMsg = strtolower(trim($input["message"] ?? ""));

$response = "";

// Simple offline chatbot logic
if (strpos($userMsg, "drug") !== false) {
    $response = "Drugs harm your body and mind. Please stay strong and seek help if needed.";
}
elseif (strpos($userMsg, "help") !== false || strpos($userMsg, "support") !== false) {
    $response = "You are not alone. You can reach out to our support team anytime.";
}
elseif (strpos($userMsg, "stress") !== false) {
    $response = "Stress can be reduced with deep breathing and talking to someone you trust.";
}
elseif (strpos($userMsg, "hi") !== false || strpos($userMsg, "hello") !== false) {
    $response = "Hello! How can I support you today?";
}
elseif ($userMsg === "") {
    $response = "Please type something so I can help you.";
}
else {
    $response = "I'm here to help with awareness, health, and emotional support. Can you tell me more?";
}

// Return JSON
echo json_encode([
    "reply" => $response
]);
?>
