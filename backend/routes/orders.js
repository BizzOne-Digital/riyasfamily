const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Promotion = require('../models/Promotion');
const Settings = require('../models/Settings');
const authMiddleware = require('../middleware/auth');

const round2 = n => Math.round(n * 100) / 100;

// Rebuild order lines from the database so prices, options and discounts can't be tampered with
async function priceOrder({ items = [], promoCode }) {
  const menuItems = await MenuItem.find({ _id: { $in: items.map(i => i.menuItem) }, isAvailable: true });
  const byId = new Map(menuItems.map(m => [m._id.toString(), m]));

  const lines = items.map(line => {
    const item = byId.get(String(line.menuItem));
    if (!item) throw new Error('An item in your order is no longer available');
    const quantity = Math.max(1, parseInt(line.quantity, 10) || 1);
    const chosen = line.options || [];

    const options = [];
    for (const group of item.optionGroups || []) {
      const picks = chosen.filter(o => o.group === group.name);
      if (group.required && picks.length === 0) throw new Error(`Please choose: ${group.name} (${item.name})`);
      if (group.maxSelect > 0 && picks.length > group.maxSelect) throw new Error(`Too many choices for ${group.name} (${item.name})`);
      for (const pick of picks) {
        const opt = group.options.find(o => o.name === pick.name);
        if (!opt) throw new Error(`Invalid option "${pick.name}" for ${item.name}`);
        options.push({ group: group.name, name: opt.name, price: opt.price || 0 });
      }
    }

    const price = round2(item.price + options.reduce((s, o) => s + o.price, 0));
    return { menuItem: item._id, name: item.name, price, quantity, options };
  });

  const subtotal = round2(lines.reduce((s, l) => s + l.price * l.quantity, 0));

  // A valid promo code wins; otherwise apply the best automatic (no-code) promotion
  let promo = null;
  const code = (promoCode || '').trim().toUpperCase();
  if (code) {
    promo = await Promotion.findOne({ code });
    if (!promo || !promo.isLive() || promo.discountFor(subtotal) === 0) throw new Error('Promo code is invalid or not applicable');
  } else {
    const autos = (await Promotion.find({ isActive: true, $or: [{ code: '' }, { code: null }] })).filter(p => p.isLive());
    promo = autos.sort((a, b) => b.discountFor(subtotal) - a.discountFor(subtotal))[0] || null;
    if (promo && promo.discountFor(subtotal) === 0) promo = null;
  }
  const discount = promo ? promo.discountFor(subtotal) : 0;

  return {
    items: lines,
    subtotal,
    discount,
    promotion: promo ? { title: promo.title, code: promo.code || '' } : undefined,
    totalAmount: round2(subtotal - discount),
  };
}

// POST /api/orders/quote - Public: price the cart (used at checkout)
router.post('/quote', async (req, res) => {
  try {
    res.json(await priceOrder(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/orders - Public: place a new order
router.post('/', async (req, res) => {
  let priced;
  try {
    if (!req.body.items?.length) throw new Error('Your cart is empty');
    priced = await priceOrder(req.body);
    const settings = await Settings.get();
    const method = settings.paymentMethods.find(m => m.isActive && m.name === req.body.paymentMethod);
    if (!method) throw new Error('Please choose a payment method');
    priced.paymentMethod = method.name;
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  try {
    const { customerName, customerEmail, customerPhone, orderType, deliveryAddress, notes } = req.body;
    const order = new Order({ customerName, customerEmail, customerPhone, orderType, deliveryAddress, notes, ...priced });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully!', orderId: order._id, totalAmount: order.totalAmount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders - Admin: get all orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders/stats - Admin: dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalOrders, todayOrders, revenue, pendingOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.countDocuments({ status: { $in: ['Received', 'Preparing'] } })
    ]);

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue: revenue[0]?.total || 0,
      pendingOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/orders/:id/status - Admin: update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
