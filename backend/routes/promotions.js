const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const authMiddleware = require('../middleware/auth');

// GET /api/promotions - Public: live promotions shown on the website
router.get('/', async (req, res) => {
  try {
    const promos = await Promotion.find({ isActive: true, showBanner: true }).sort({ createdAt: -1 });
    res.json(promos.filter(p => p.isLive()));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/promotions/all - Admin: all promotions
router.get('/all', authMiddleware, async (req, res) => {
  try {
    res.json(await Promotion.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/promotions/check - Public: check a promo code against a subtotal
router.post('/check', async (req, res) => {
  try {
    const code = (req.body.code || '').trim().toUpperCase();
    const promo = code && await Promotion.findOne({ code });
    if (!promo || !promo.isLive()) return res.status(404).json({ message: 'Invalid or expired promo code' });
    const subtotal = Number(req.body.subtotal) || 0;
    if (subtotal < promo.minOrder) {
      return res.status(400).json({ message: `Minimum order of $${promo.minOrder.toFixed(2)} required` });
    }
    res.json({ title: promo.title, code: promo.code, discount: promo.discountFor(subtotal) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/promotions - Admin: add promotion
router.post('/', authMiddleware, async (req, res) => {
  try {
    const promo = new Promotion(req.body);
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/promotions/:id - Admin: update promotion
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const promo = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/promotions/:id - Admin: delete promotion
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promotion deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
