require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiters
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: 'Too many requests. Please try again later.' }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many messages. Please slow down.' }
});

// Routes
app.use('/api/contact', contactLimiter, require('./routes/contact'));
app.use('/api/chat', chatLimiter, require('./routes/chat'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Serve index.html for all unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio server running on port ${PORT}`);
});
