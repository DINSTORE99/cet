<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = 'mysql-2ed34a9f-pudin.j.aivencloud.com';
$port = '17003';
$db   = 'defaultdb';
$user = 'avnadmin';
$pass = 'AVNS_9LRs9wXX1WCh-z3GTh8'; // Ganti dengan password dari Aiven

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Koneksi Database Gagal: " . $e->getMessage());
}

// Fungsi Mengambil Pengaturan dari Database
function getSetting($key) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT key_value FROM settings WHERE key_name = ?");
        $stmt->execute([$key]);
        $res = $stmt->fetch();
        return $res ? $res['key_value'] : '';
    } catch (PDOException $e) {
        return '';
    }
}

// Fungsi Kirim Notifikasi Telegram
function sendTelegramNotification($message) {
    $token = getSetting('telegram_token');
    $chat_id = getSetting('telegram_chat_id');
    if (!empty($token) && !empty($chat_id)) {
        $url = "https://api.telegram.org/bot$token/sendMessage";
        $data = ['chat_id' => $chat_id, 'text' => $message, 'parse_mode' => 'Markdown'];
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_exec($ch);
        curl_close($ch);
    }
}
?>

