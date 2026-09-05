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
    
    if (action === 'sync_user') {
      return res.status(200).json({ success: true, message: 'User disinkronkan di serverless session', data });
    }
    
    return res.status(200).json({ success: true, message: 'Request berhasil diproses', data });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
