<?php
require_once 'config.php';
if (!isset($_SESSION['admin_logged'])) { header("Location: /api/login.php"); exit; }

if (isset($_POST['add_server'])) {
    $name = trim($_POST['server_name']);
    $stmt = $pdo->prepare("INSERT INTO servers (server_name) VALUES (?)");
    $stmt->execute([$name]);
    header("Location: /admin/servers");
    exit;
}

if (isset($_GET['del'])) {
    $id = $_GET['del'];
    $pdo->prepare("DELETE FROM servers WHERE id = ?")->execute([$id]);
    header("Location: /admin/servers");
    exit;
}

$servers = $pdo->query("SELECT * FROM servers")->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8"><title>Kelola Server</title>
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
                <a class="nav-link active" href="/admin/servers">Server</a>
                <a class="nav-link" href="/admin/settings">Pengaturan</a>
                <a class="nav-link text-danger" href="/logout">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container my-4">
        <h2>Manajemen Server & Kategori</h2>
        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card shadow-sm p-3">
                    <h5>Tambah Server</h5>
                    <form method="POST">
                        <div class="mb-3">
                            <label class="form-label">Nama Server</label>
                            <input type="text" name="server_name" class="form-control" placeholder="Misal: Server Utama" required>
                        </div>
                        <button type="submit" name="add_server" class="btn btn-primary w-100">Simpan</button>
                    </form>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card shadow-sm p-3">
                    <h5>Daftar Server</h5>
                    <table class="table table-striped mt-2">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Server</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $no=1; foreach($servers as $s): ?>
                            <tr>
                                <td><?= $no++ ?></td>
                                <td><?= htmlspecialchars($s['server_name']) ?></td>
                                <td><span class="badge bg-success"><?= $s['status'] ?></span></td>
                                <td><a href="/admin/servers?del=<?= $s['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Hapus server ini?')">Hapus</a></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

