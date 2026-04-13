const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  if (!process.env.WEB3FORMS_KEY) {
    return res.status(503).json({ error: 'Contact form not configured. Please email btale05.bt@gmail.com directly.' });
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        name,
        email,
        subject: `[Portfolio] ${subject || 'New Contact'} — from ${name}`,
        message,
        from_name: 'Bhupendra Portfolio'
      })
    });

    const data = await response.json();

    if (data.success) {
      res.json({ success: true, message: 'Message sent successfully!' });
    } else {
      throw new Error(data.message || 'Web3Forms submission failed');
    }
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please email btale05.bt@gmail.com directly.' });
  }
});

module.exports = router;
