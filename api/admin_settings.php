<?php
require_once 'config.php';
if (!isset($_SESSION['admin_logged'])) { header("Location: /api/login.php"); exit; }

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    foreach ($_POST as $key => $value) {
        $stmt = $pdo->prepare("UPDATE settings SET key_value = ? WHERE key_name = ?");
        $stmt->execute([trim($value), $key]);
    }
    $success = "Pengaturan berhasil diperbarui!";
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><title>Pengaturan Website</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/admin">Panel Admin</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="/admin">Dashboard</a>
                <a class="nav-link" href="/admin/transactions">Riwayat Transaksi</a>
                <a class="nav-link" href="/admin/topups">Riwayat Topup</a>
                <a class="nav-link" href="/admin/servers">Server</a>
                <a class="nav-link active" href="/admin/settings">Pengaturan</a>
                <a class="nav-link text-danger" href="/logout">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container my-4 col-md-8">
        <h2>Pengaturan Website, API Dinns & Telegram</h2>
        <?php if(isset($success)): ?>
            <div class="alert alert-success mt-3"><?= $success ?></div>
        <?php endif; ?>
        <form method="POST" class="card shadow-sm p-4 mt-3">
            <div class="mb-3">
                <label class="form-label fw-bold">Judul Website</label>
                <input type="text" name="site_title" class="form-control" value="<?= htmlspecialchars(getSetting('site_title')) ?>">
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Teks Footer</label>
                <input type="text" name="footer_text" class="form-control" value="<?= htmlspecialchars(getSetting('footer_text')) ?>">
            </div>
            <hr>
            <div class="mb-3">
                <label class="form-label fw-bold">Dinns API ID / Username</label>
                <input type="text" name="dinns_api_id" class="form-control" value="<?= htmlspecialchars(getSetting('dinns_api_id')) ?>">
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Dinns API Key</label>
                <input type="text" name="dinns_api_key" class="form-control" value="<?= htmlspecialchars(getSetting('dinns_api_key')) ?>">
            </div>
            <hr>
            <div class="mb-3">
                <label class="form-label fw-bold">Telegram Bot Token</label>
                <input type="text" name="telegram_token" class="form-control" value="<?= htmlspecialchars(getSetting('telegram_token')) ?>">
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Telegram Chat ID</label>
                <input type="text" name="telegram_chat_id" class="form-control" value="<?= htmlspecialchars(getSetting('telegram_chat_id')) ?>">
            </div>
            <button type="submit" class="btn btn-primary w-100">Simpan Perubahan</button>
        </form>
    </div>
</body>
</html>

