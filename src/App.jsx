import React, { useState } from 'react';

export default function App() {
  // State User & Auth Mock (Google OAuth Simulation)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('ver_user')) || null);
  const [view, setView] = useState('dashboard');

  // Pengaturan Global Dinamis (Bisa diatur Admin)
  const [settings, setSettings] = useState({
    siteName: 'Vercel Member Panel',
    maintenanceMode: false,
    googleLoginEnabled: true,
    defaultBalance: 50000
  });

  // Data Seluruh Member
  const [members, setMembers] = useState([
    { id: 1, name: 'Admin Sistem', email: 'admin@vercel.com', avatar: 'https://via.placeholder.com/150', balance: 500000, role: 'Admin', status: 'Active' },
    { id: 2, name: 'Budi Santoso', email: 'budi@gmail.com', avatar: 'https://via.placeholder.com/150', balance: 120000, role: 'Reseller', status: 'Active' },
    { id: 3, name: 'Siti Aminah', email: 'siti@gmail.com', avatar: 'https://via.placeholder.com/150', balance: 25000, role: 'Member', status: 'Active' }
  ]);

  // Riwayat Saldo & Transaksi
  const [transactions, setTransactions] = useState([]);
  
  // Modal Edit Saldo
  const [targetMember, setTargetMember] = useState(null);
  const [saldoForm, setSaldoForm] = useState({ type: '+', amount: '', reason: '' });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGoogleLogin = () => {
    const loggedUser = members[0]; // Simulasi login sebagai admin/member
    setUser(loggedUser);
    localStorage.setItem('ver_user', JSON.stringify(loggedUser));
    showToast('Berhasil masuk dengan Google!');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ver_user');
    showToast('Berhasil keluar');
  };

  const handleSaveBalance = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(saldoForm.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Masukkan nominal yang valid', 'error');
      return;
    }

    const updated = members.map(m => {
      if (m.id === targetMember.id) {
        const prev = m.balance;
        const curr = saldoForm.type === '+' ? prev + amountNum : prev - amountNum;
        
        // Catat Riwayat
        setTransactions(prevTrx => [{
          id: 'TRX-' + Date.now(),
          userName: m.name,
          type: saldoForm.type,
          amount: amountNum,
          prevBalance: prev,
          newBalance: curr,
          reason: saldoForm.reason,
          admin: user.name,
          time: new Date().toLocaleTimeString()
        }, ...prevTrx]);

        return { ...m, balance: curr };
      }
      return m;
    });

    setMembers(updated);
    showToast('Saldo berhasil diperbarui!');
    setTargetMember(null);
    setSaldoForm({ type: '+', amount: '', reason: '' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md text-center shadow-2xl">
          <h1 className="text-2xl font-black mb-2">VERCEL PANEL</h1>
          <p className="text-slate-400 text-sm mb-6">Sistem Manajemen Member Tanpa Database</p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-slate-950 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition shadow-lg"
          >
            Masuk dengan Google (OAuth)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-white text-sm shadow-xl ${toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-lg font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-8">
            {settings.siteName}
          </h2>
          <nav className="space-y-1 text-sm font-medium">
            <button onClick={() => setView('dashboard')} className={`w-full text-left px-4 py-2.5 rounded-xl ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>Dashboard</button>
            <button onClick={() => setView('users')} className={`w-full text-left px-4 py-2.5 rounded-xl ${view === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>Data Member</button>
            <button onClick={() => setView('transactions')} className={`w-full text-left px-4 py-2.5 rounded-xl ${view === 'transactions' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>Riwayat Saldo</button>
            {user.role === 'Admin' && (
              <button onClick={() => setView('admin')} className={`w-full text-left px-4 py-2.5 rounded-xl ${view === 'admin' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>Admin Panel</button>
            )}
          </nav>
        </div>
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-700" alt="" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-xs font-semibold">Keluar</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Pribadi</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-xs text-slate-400 mb-1">Saldo Anda</p>
                <h3 className="text-2xl font-black text-emerald-400">Rp {user.balance.toLocaleString()}</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-xs text-slate-400 mb-1">Role Member</p>
                <h3 className="text-xl font-bold text-blue-400">{user.role}</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-xs text-slate-400 mb-1">Status Akun</p>
                <h3 className="text-xl font-bold text-indigo-400">{user.status}</h3>
              </div>
            </div>
          </div>
        )}

        {view === 'users' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Data Seluruh Member</h1>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                    <th className="p-4">Member</th>
                    <th className="p-4">Saldo</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {members.map(m => (
                    <tr key={m.id} className="hover:bg-slate-800/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={m.avatar} className="w-8 h-8 rounded-full" alt="" />
                        <div>
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.email}</p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">Rp {m.balance.toLocaleString()}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-800 rounded text-xs">{m.role}</span></td>
                      <td className="p-4">
                        <button onClick={() => setTargetMember(m)} className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg text-xs font-semibold">Atur Saldo</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'transactions' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Riwayat Perubahan Saldo</h1>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                    <th className="p-4">Waktu</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Jenis</th>
                    <th className="p-4">Nominal</th>
                    <th className="p-4">Alasan</th>
                    <th className="p-4">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-mono">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/50">
                      <td className="p-4 text-slate-400">{t.time}</td>
                      <td className="p-4 font-semibold text-white">{t.userName}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded ${t.type === '+' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{t.type}</span></td>
                      <td className="p-4 text-emerald-400">Rp {t.amount.toLocaleString()}</td>
                      <td className="p-4 text-slate-300 font-sans">{t.reason}</td>
                      <td className="p-4 text-slate-400 font-sans">{t.admin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'admin' && user.role === 'Admin' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Panel Administrator & Pengaturan</h1>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-xl">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nama Website</label>
                <input 
                  type="text" 
                  value={settings.siteName} 
                  onChange={e => setSettings({...settings, siteName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-sm font-semibold">Mode Pemeliharaan (Maintenance)</span>
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode} 
                  onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="w-5 h-5 accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Atur Saldo */}
      {targetMember && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-2">Atur Saldo: {targetMember.name}</h3>
            <p className="text-xs text-slate-400 mb-4">Saldo Saat Ini: <span className="text-emerald-400 font-bold">Rp {targetMember.balance.toLocaleString()}</span></p>
            
            <form onSubmit={handleSaveBalance} className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="type" checked={saldoForm.type === '+'} onChange={() => setSaldoForm({...saldoForm, type: '+'})} /> Tambah (+)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="type" checked={saldoForm.type === '-'} onChange={() => setSaldoForm({...saldoForm, type: '-'})} /> Kurangi (-)
                </label>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nominal (Rp)</label>
                <input 
                  type="number" 
                  required 
                  value={saldoForm.amount} 
                  onChange={e => setSaldoForm({...saldoForm, amount: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Alasan / Catatan</label>
                <textarea 
                  required 
                  value={saldoForm.reason} 
                  onChange={e => setSaldoForm({...saldoForm, reason: e.target.value})} 
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm"
                  placeholder="Contoh: Bonus top-up bulanan"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setTargetMember(null)} className="w-1/2 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl text-sm font-semibold">Batal</button>
                <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-semibold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
