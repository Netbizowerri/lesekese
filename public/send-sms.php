<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['content']) || empty($input['to'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: content, to']);
    exit;
}

$apiKey = 'pk_VL-92eHjZqETQuxmMDzUyIwENUsEPeJ_EIJwiaUvJx9beDfZTRj82muhFQgQPv4p';
$from  = '+2348023725740';
$to    = $input['to'];
$content = $input['content'];

$ch = curl_init('https://api.httpsms.com/v1/messages/send');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'x-api-key: ' . $apiKey,
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'from'    => $from,
        'to'      => $to,
        'content' => $content,
    ]),
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;
