const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, uppercase: true, trim: true }, // empty = applies automatically at checkout
  discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  showBanner: { type: Boolean, default: true }, // show on website
  createdAt: { type: Date, default: Date.now }
});

// Is the promotion running right now?
promotionSchema.methods.isLive = function (now = new Date()) {
  if (!this.isActive) return false;
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  return true;
};

promotionSchema.methods.discountFor = function (subtotal) {
  if (subtotal < (this.minOrder || 0)) return 0;
  const d = this.discountType === 'percent'
    ? subtotal * this.discountValue / 100
    : this.discountValue;
  return Math.round(Math.min(d, subtotal) * 100) / 100;
};

module.exports = mongoose.model('Promotion', promotionSchema);
