<?php
require_once 'config.php';
if (!isset($_SESSION['admin_logged'])) { header("Location: /api/login.php"); exit; }
$topups = $pdo->query("SELECT * FROM topups ORDER BY id DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><title>Riwayat Topup</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/admin">Panel Admin</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="/admin">Dashboard</a>
                <a class="nav-link" href="/admin/transactions">Riwayat Transaksi</a>
                <a class="nav-link active" href="/admin/topups">Riwayat Topup</a>
                <a class="nav-link" href="/admin/servers">Server</a>
                <a class="nav-link" href="/admin/settings">Pengaturan</a>
                <a class="nav-link text-danger" href="/logout">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container my-4">
        <h2>Riwayat Pengisian Saldo (Topup)</h2>
        <div class="card shadow-sm p-3 mt-3">
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID / Nama</th>
                            <th>Jumlah Topup</th>
                            <th>Metode Pembayaran</th>
                            <th>Status</th>
                            <th>Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($topups as $tp): ?>
                        <tr>
                            <td><?= $tp['id'] ?></td>
                            <td><?= htmlspecialchars($tp['user_id']) ?></td>
                            <td>Rp <?= number_format($tp['amount'], 0, ',', '.') ?></td>
                            <td><?= htmlspecialchars($tp['payment_method']) ?></td>
                            <td><span class="badge bg-success"><?= htmlspecialchars($tp['status']) ?></span></td>
                            <td><?= $tp['created_at'] ?></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
