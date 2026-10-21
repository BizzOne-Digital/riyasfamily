const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Appetizers', 'Soups', 'Salads', 'Burgers', 'Sandwiches & Wraps', 'Poutines', 'Lighter Meals', 'Main Entrees', 'Pastas & Bowls', 'Gluten Free'],
    required: true
  },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' }, // Cloudinary public_id for deletion
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  dietaryTags: [{ type: String }], // e.g. ['Vegan', 'Gluten-Free']
  // Add-ons / choices, e.g. "Choose a side" (required, pick 1) or "Extras" (optional, pick many)
  optionGroups: [
    {
      name: { type: String, required: true },
      required: { type: Boolean, default: false },
      maxSelect: { type: Number, default: 1 }, // 0 = no limit
      options: [
        {
          name: { type: String, required: true },
          price: { type: Number, default: 0 } // extra charge
        }
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
