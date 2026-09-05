export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { action, data } = req.body;
    
    // Simulasi pemrosesan backend tanpa database permanen
    if (action === 'update_balance') {
      return res.status(200).json({ success: true, message: 'Saldo berhasil diperbarui di serverless session' });
    }
    
    return res.status(200).json({ success: true, message: 'Request diterima', data });
  }

  res.status(405).json({ error: 'Method not allowed' });
}

