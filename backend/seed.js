/**
 * SEED FILE — Riya's Family Dining
 * Run once to create admin + sample menu items
 *
 * Usage:
 *   cd backend
 *   node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const MenuItem = require('./models/MenuItem');

const ADMIN = {
  name: 'Manivannan Mohan',
  email: 'mani15209@gmail.com',
  password: 'Riyas@2024',   // <-- change this after first login
};

const MENU_ITEMS = [
  // ── Appetizers ──────────────────────────────────────────
  {
    name: 'Samosa (2 pcs)',
    description: 'Crispy golden pastry filled with spiced potatoes and peas. Served with mint chutney.',
    price: 5.99,
    category: 'Appetizers',
    isAvailable: true,
    isPopular: true,
    dietaryTags: ['Vegan'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80',
  },
  {
    name: 'Chicken Tikka Starter',
    description: 'Tender chunks of chicken marinated in yogurt and spices, grilled in tandoor.',
    price: 10.99,
    category: 'Appetizers',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  },
  {
    name: 'Vegetable Pakora',
    description: 'Mixed vegetables coated in seasoned chickpea batter and deep fried. Served with tamarind sauce.',
    price: 7.49,
    category: 'Appetizers',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegan'],
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80',
  },

  // ── Main Courses ─────────────────────────────────────────
  {
    name: 'Butter Chicken',
    description: 'Classic creamy tomato-based curry with tender chicken pieces. A crowd favourite.',
    price: 16.99,
    category: 'Main Courses',
    isAvailable: true,
    isPopular: true,
    dietaryTags: ['Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80',
  },
  {
    name: 'Lamb Rogan Josh',
    description: 'Slow-cooked aromatic lamb curry with Kashmiri spices. Rich, bold flavour.',
    price: 18.99,
    category: 'Main Courses',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&q=80',
  },
  {
    name: 'Palak Paneer',
    description: 'Fresh cottage cheese cubes in a smooth spiced spinach gravy. Light and nutritious.',
    price: 14.99,
    category: 'Main Courses',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
  },
  {
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice layered with spiced chicken, caramelised onions, and saffron.',
    price: 17.99,
    category: 'Main Courses',
    isAvailable: true,
    isPopular: true,
    dietaryTags: ['Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  },
  {
    name: 'Dal Makhani',
    description: 'Black lentils slow-simmered overnight with butter and cream. Velvety and comforting.',
    price: 13.99,
    category: 'Main Courses',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
  },

  // ── Family Meals ─────────────────────────────────────────
  {
    name: 'Family Feast (4 ppl)',
    description: 'Butter Chicken + Lamb Rogan Josh + Dal Makhani + 8 Naan + Rice + 4 Samosas. Perfect for families!',
    price: 64.99,
    category: 'Family Meals',
    isAvailable: true,
    isPopular: true,
    dietaryTags: [],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  },
  {
    name: 'Vegetarian Family Pack',
    description: 'Palak Paneer + Dal Makhani + Chana Masala + 8 Roti + Rice + Raita. Great for veggie families.',
    price: 52.99,
    category: 'Family Meals',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  },
  {
    name: 'Biryani Party Pack',
    description: 'Large pot of Chicken Biryani (serves 4–5) with raita, salad, and papadum.',
    price: 58.99,
    category: 'Family Meals',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80',
  },

  // ── Desserts ─────────────────────────────────────────────
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup. Served warm.',
    price: 5.99,
    category: 'Desserts',
    isAvailable: true,
    isPopular: true,
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1666360829863-849e3d14fb62?w=600&q=80',
  },
  {
    name: 'Mango Kulfi',
    description: 'Traditional Indian ice cream made with condensed milk and real mango pulp.',
    price: 6.49,
    category: 'Desserts',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80',
  },
  {
    name: 'Kheer',
    description: 'Classic rice pudding slow-cooked with milk, cardamom, saffron, and pistachios.',
    price: 5.49,
    category: 'Desserts',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1604835775076-4b3b3d3d3d3d?w=600&q=80',
  },

  // ── Beverages ────────────────────────────────────────────
  {
    name: 'Mango Lassi',
    description: 'Refreshing blended yogurt drink with sweet Alphonso mango. Chilled and creamy.',
    price: 4.99,
    category: 'Beverages',
    isAvailable: true,
    isPopular: true,
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80',
  },
  {
    name: 'Masala Chai',
    description: 'Freshly brewed spiced tea with ginger, cardamom, cinnamon, and whole milk.',
    price: 3.49,
    category: 'Beverages',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&q=80',
  },
  {
    name: 'Rose Sharbat',
    description: 'Chilled rose syrup drink with basil seeds and lemon. Sweet and floral.',
    price: 3.99,
    category: 'Beverages',
    isAvailable: true,
    isPopular: false,
    dietaryTags: ['Vegan', 'Gluten-Free'],
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // ── Create Admin ──────────────────────────────────────
    const existing = await Admin.findOne({ email: ADMIN.email });
    if (existing) {
      console.log('ℹ️  Admin already exists:', ADMIN.email);
    } else {
      await Admin.create(ADMIN);
      console.log('✅ Admin created:', ADMIN.email, '| Password:', ADMIN.password);
    }

    // ── Seed Menu Items ───────────────────────────────────
    const count = await MenuItem.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Menu already has ${count} items — skipping menu seed.`);
      console.log('   (Delete all items from admin panel first if you want to reseed)');
    } else {
      await MenuItem.insertMany(MENU_ITEMS);
      console.log(`✅ ${MENU_ITEMS.length} menu items seeded successfully`);
    }

    console.log('\n🎉 Seed complete! Login at /admin/login with:');
    console.log('   Email:', ADMIN.email);
    console.log('   Password:', ADMIN.password);
    console.log('   ⚠️  Change your password after first login!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();