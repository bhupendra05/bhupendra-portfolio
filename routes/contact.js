const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,
      socketTimeout: 10000
    });

    // Email to Bhupendra
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `[Portfolio] ${subject || 'New Contact'} — from ${name}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0f; color: #00ffff; padding: 30px; border: 1px solid #00ffff;">
          <h2 style="color: #ff00ff; text-transform: uppercase;">⚡ New Client Inquiry</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px; color:#7b2fff; width:120px;">NAME</td><td style="color:#fff;">${name}</td></tr>
            <tr><td style="padding:8px; color:#7b2fff;">EMAIL</td><td style="color:#fff;">${email}</td></tr>
            <tr><td style="padding:8px; color:#7b2fff;">SUBJECT</td><td style="color:#fff;">${subject || '—'}</td></tr>
            <tr><td style="padding:8px; color:#7b2fff; vertical-align:top;">MESSAGE</td><td style="color:#fff; white-space:pre-wrap;">${message}</td></tr>
          </table>
        </div>
      `
    });

    // Auto-reply to client
    await transporter.sendMail({
      from: `"Bhupendra Tale — AI Engineer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Got your message, ${name} — I'll be in touch soon`,
      html: `
        <div style="font-family: monospace; background: #0a0a0f; color: #00ffff; padding: 30px; border: 1px solid #00ffff;">
          <h2 style="color: #ff00ff;">Hello, ${name}!</h2>
          <p style="color: #fff;">Your message has been received. I typically respond within 24 hours.</p>
          <p style="color: #7b2fff; font-size:12px;">— Bhupendra Tale | AI Engineer & Full-Stack Developer</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please email btale05.bt@gmail.com directly.' });
  }
});

module.exports = router;
