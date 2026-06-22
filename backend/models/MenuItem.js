const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Appetizers', 'Main Courses', 'Family Meals', 'Desserts', 'Beverages'],
    required: true
  },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' }, // Cloudinary public_id for deletion
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  dietaryTags: [{ type: String }], // e.g. ['Vegan', 'Gluten-Free']
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
