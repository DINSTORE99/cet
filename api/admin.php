<?php
require_once 'config.php';
if (!isset($_SESSION['admin_logged'])) { header("Location: /api/login.php"); exit; }

$total_trx = $pdo->query("SELECT COUNT(*) FROM transactions")->fetchColumn();
$total_topup = $pdo->query("SELECT SUM(amount) FROM topups WHERE status = 'Success'")->fetchColumn() ?: 0;
$total_server = $pdo->query("SELECT COUNT(*) FROM servers")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/admin">Panel Admin</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link active" href="/admin">Dashboard</a>
                <a class="nav-link" href="/admin/transactions">Riwayat Transaksi</a>
                <a class="nav-link" href="/admin/topups">Riwayat Topup</a>
                <a class="nav-link" href="/admin/servers">Server</a>
                <a class="nav-link" href="/admin/settings">Pengaturan</a>
                <a class="nav-link text-danger" href="/logout">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container my-4">
        <h2>Dashboard Statistik</h2>
        <div class="row my-4">
            <div class="col-md-4">
                <div class="card bg-primary text-white p-3 shadow-sm">
                    <h5>Total Transaksi</h5>
                    <h3><?= $total_trx ?></h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-success text-white p-3 shadow-sm">
                    <h5>Total Topup Sukses</h5>
                    <h3>Rp <?= number_format($total_topup, 0, ',', '.') ?></h3>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-dark text-white p-3 shadow-sm">
                    <h5>Server Aktif</h5>
                    <h3><?= $total_server ?></h3>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

