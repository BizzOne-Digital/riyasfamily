const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const authMiddleware = require('../middleware/auth');

// GET /api/settings/payment-methods - Public: active payment methods
router.get('/payment-methods', async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json(settings.paymentMethods.filter(m => m.isActive));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/settings - Admin: full settings
router.get('/', authMiddleware, async (req, res) => {
  try {
    res.json(await Settings.get());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/settings - Admin: update settings
router.put('/', authMiddleware, async (req, res) => {
  try {
    const settings = await Settings.get();
    settings.paymentMethods = req.body.paymentMethods;
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
