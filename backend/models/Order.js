const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  orderType: {
    type: String,
    enum: ['Dine-in', 'Takeout', 'Delivery'],
    required: true
  },
  deliveryAddress: { type: String },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      name: String,
      price: Number, // unit price including options
      quantity: { type: Number, required: true },
      options: [{ group: String, name: String, price: Number }]
    }
  ],
  subtotal: { type: Number },
  promotion: { title: String, code: String },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String },
  status: {
    type: String,
    enum: ['Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Received'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
