// api/complete.js - Pi Server-Side Completion
// This is called AFTER blockchain transaction succeeds
// You MUST complete it or user will be charged but order fails

const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId || !txid) return res.status(400).json({ error: 'paymentId and txid required' });
  if (!PI_API_KEY) return res.status(500).json({ error: 'PI_API_KEY not set' });

  try {
    // Complete payment on Pi Platform
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      {
        headers: {
          'Authorization': `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[Royal Pi] Completed payment: ${paymentId} Tx: ${txid}`);

    // TODO: Fulfill the order here - this is where you mark as paid
    // await db.collection('orders').updateOne(
    //   { paymentId }, 
    //   { $set: { status: 'completed', txid, completedAt: new Date() } }
    // );
    // await sendConfirmationEmail(paymentId);
    // await updateInventory(paymentId);

    return res.status(200).json({
      completed: true,
      paymentId,
      txid,
      message: 'Royal Pi order completed - Thank you for shopping with Pi!'
    });

  } catch (error) {
    console.error('[Royal Pi] Complete Error:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to complete Pi payment',
      details: error.response?.data || error.message
    });
  }
};
