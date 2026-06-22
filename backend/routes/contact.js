const express = require('express');
const router = express.Router();

// POST /api/contact - Public: send contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    // In production, integrate with email service (e.g. nodemailer)
    console.log('New contact message:', { name, email, phone, message });
    res.json({ message: 'Message received! We will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
