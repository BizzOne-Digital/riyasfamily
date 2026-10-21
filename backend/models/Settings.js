const mongoose = require('mongoose');

// Single settings document for the restaurant
const settingsSchema = new mongoose.Schema({
  paymentMethods: {
    type: [
      {
        name: { type: String, required: true },
        instructions: { type: String }, // shown to the customer at checkout
        isActive: { type: Boolean, default: true }
      }
    ],
    default: [
      { name: 'Pay at Pickup / Delivery (Cash or Card)', instructions: '', isActive: true },
      { name: 'E-Transfer', instructions: 'Send payment by Interac e-Transfer. We will confirm your order once received.', isActive: false }
    ]
  }
});

settingsSchema.statics.get = async function () {
  return (await this.findOne()) || this.create({});
};

module.exports = mongoose.model('Settings', settingsSchema);
