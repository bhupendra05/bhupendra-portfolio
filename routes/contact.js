const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

let resend = null;
function getResend() {
  if (!resend && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('REPLACE')) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const client = getResend();
  if (!client) {
    return res.status(503).json({ error: 'Contact form not configured. Please email btale05.bt@gmail.com directly.' });
  }

  try {
    const { error } = await client.emails.send({
      from: 'Bhupendra Portfolio <onboarding@resend.dev>',
      to: ['btale05.bt@gmail.com'],
      reply_to: email,
      subject: `[Portfolio] ${subject || 'New Contact'} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; padding: 32px; border-radius: 8px; border: 1px solid #00ffff33;">
          <h2 style="color: #00ffff; margin-top: 0;">New Portfolio Contact</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 80px;">Name</td><td style="padding: 8px 0; color: #fff;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0; color: #00ffff;"><a href="mailto:${email}" style="color:#00ffff;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Subject</td><td style="padding: 8px 0; color: #fff;">${subject || '—'}</td></tr>
          </table>
          <hr style="border-color: #00ffff33; margin: 20px 0;" />
          <p style="color: #888; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
          <p style="color: #e0e0e0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          <hr style="border-color: #333; margin: 24px 0;" />
          <p style="color: #555; font-size: 12px; margin: 0;">Sent from bhupendra-portfolio on Railway · Reply directly to reply to ${name}</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message || 'Resend failed');
    }

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please email btale05.bt@gmail.com directly.' });
  }
});

module.exports = router;
