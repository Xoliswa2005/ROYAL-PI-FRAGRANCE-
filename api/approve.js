// api/approve.js - Pi Server-Side Approval
// This is called BEFORE blockchain transaction
// Documentation: https://github.com/pi-apps/pi-platform-docs

const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { paymentId } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId) return res.status(400).json({ error: 'paymentId required' });
  if (!PI_API_KEY) return res.status(500).json({ error: 'PI_API_KEY not set in Vercel' });

  try {
    // Approve payment on Pi Platform
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[Royal Pi] Approved payment: ${paymentId}`);
    
    // TODO: Save to your DB as approved
    // await db.collection('orders').insertOne({ paymentId, status: 'approved', createdAt: new Date() });

    return res.status(200).json({ 
      approved: true, 
      paymentId,
      message: 'Royal Pi Fragrance payment approved'
    });

  } catch (error) {
    console.error('[Royal Pi] Approve Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to approve Pi payment',
      details: error.response?.data || error.message
    });
  }
};
