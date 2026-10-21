/**
 * SEED FILE — Riya's Family Dining
 * Run once to create admin + sample menu items
 *
 * Usage:
 *   cd backend
 *   node seed.js            (seed only if menu is empty)
 *   node seed.js --reset    (replace existing menu with the one below)
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
  { name: 'Breaded Wings', description: 'Pound of breaded wings with house dill dip. Dry: salt & pepper, lemon pepper, Cajun. Sauce: hot, teriyaki, honey garlic, sweet chili, BBQ.', price: 17.95, category: 'Appetizers', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },
  { name: 'Bone In Pork Ribs', description: 'Bone in pork ribs served with roasted garlic aioli.', price: 15.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Deep Fried Pickles', description: 'Served with chipotle aioli.', price: 14.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Steak Bites', description: 'Marinated sirloin bites pan fried with garlic butter, served with roasted garlic aioli.', price: 18.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Spinach Dip', description: 'Creamy blend of spinach, artichokes, cream cheese and parmesan baked with mozzarella. Served with naan bread.', price: 19.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Calamari', description: 'Breaded calamari served with house dip and lemon wedges. Garnished with onion.', price: 17.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Cactus Cut Potatoes', description: 'Served with house dill dip.', price: 12.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Nachos', description: 'Tri-colored corn nachos loaded with tomato, onion, peppers, jalapenos and mixed cheese. Served with salsa and sour cream. Add chicken or beef +$5.', price: 14.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Sweet Potato Fries', description: 'Served with chili aioli.', price: 12.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Chicken Fingers', description: '4 pc chicken tenders with one side: fries, yam fries, cactus cut or onion rings. Served with plum or honey dill sauce.', price: 15.75, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Fries and Gravy', description: 'Crispy fries smothered in gravy.', price: 8.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Onion Rings', description: 'Golden fried onion rings.', price: 11.95, category: 'Appetizers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Pork Riblets and Caesar Salad Combo', description: 'Crispy fried pork riblets served with a fresh Caesar salad.', price: 22.95, category: 'Appetizers', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },

  // ── Soups ───────────────────────────────────────────────
  { name: 'Loaded Potato Bacon Soup (Bowl)', description: 'Creamy potato soup topped with bacon, cheese and green onions.', price: 12.95, category: 'Soups', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Loaded Potato Bacon Soup (Cup)', description: 'Creamy potato soup topped with bacon, cheese and green onions.', price: 9.95, category: 'Soups', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Lobster Bisque (Bowl)', description: 'Rich and creamy lobster bisque with a hint of sherry.', price: 13.95, category: 'Soups', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Lobster Bisque (Cup)', description: 'Rich and creamy lobster bisque with a hint of sherry.', price: 10.95, category: 'Soups', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Soup of the Day (Bowl)', description: 'Made fresh daily with seasonal ingredients.', price: 11.95, category: 'Soups', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Soup of the Day (Cup)', description: 'Made fresh daily with seasonal ingredients.', price: 7.95, category: 'Soups', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },

  // ── Salads ──────────────────────────────────────────────
  { name: 'Garden Salad (Large)', description: 'Mixed greens, tomato, cucumber, carrots and choice of dressing. Add chicken +$5.', price: 14, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Garden Salad (Small)', description: 'Mixed greens, tomato, cucumber, carrots and choice of dressing. Add chicken +$5.', price: 11, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Caesar Salad (Large)', description: 'Romaine, parmesan, bacon bits, garlic croutons, lemon wedges with creamy Caesar dressing. Add chicken +$5.', price: 15, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Caesar Salad (Small)', description: 'Romaine, parmesan, bacon bits, garlic croutons, lemon wedges with creamy Caesar dressing. Add chicken +$5.', price: 12, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Santa Fe Chicken Salad', description: 'Mixed greens, pico de gallo, mixed cheese, Cajun chicken breast, avocado, cucumber, red pepper, red onion and chipotle ranch dressing.', price: 17.75, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Country Steak Salad', description: '6 oz sirloin steak done the way you like on mixed greens, tomato, cucumber, pepper, bacon bits, mixed cheese and ranch dressing.', price: 21.95, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Spinach & Quinoa Salad', description: 'Spinach, quinoa, mixed nuts and greens topped with tomato, dried cranberry, roasted almonds and balsamic vinaigrette.', price: 18.95, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Taco Salad', description: 'Romaine topped with mixed greens, pico de gallo, cheese and your choice of chicken or taco beef. Served with salsa and sour cream.', price: 17.95, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Asian Shrimp Salad', description: 'Shrimp on a bed of tomato, cucumber, green pepper, green onion, carrots and crispy chow mein with Asian dressing.', price: 18.95, category: 'Salads', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },

  // ── Burgers ─────────────────────────────────────────────
  { name: 'Bacon and Cheddar Burger', description: '6 oz beef patty, bacon, cheddar cheese. Served with one side.', price: 17.5, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Mushroom Bacon Swiss Burger', description: '6 oz beef patty, bacon, mushroom, Swiss cheese. Served with one side.', price: 17.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Loaded Burger', description: '6 oz beef patty, bacon, ham, mushroom, cheddar cheese with a sunny side egg. Served with one side.', price: 21.95, category: 'Burgers', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },
  { name: 'Korean BBQ Chicken Burger', description: 'Chicken breast, bacon, BBQ sauce and mozzarella cheese. Served with one side.', price: 17.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Breaded Hot Chicken Burger', description: 'Breaded chicken tossed in hot sauce, bacon, cheddar. Served with one side.', price: 17.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Mexican Burger', description: '6 oz beef patty with bacon, cheddar cheese, mashed avocado and pico de gallo. Served with one side.', price: 18.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Chicken Club Burger', description: 'Chicken breast, ham, bacon, Swiss cheese. Served with one side.', price: 17.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'BBQ Mozzarella Burger', description: 'Beef patty, bacon, BBQ sauce, mozzarella cheese. Served with one side.', price: 18.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Santa Fe Chicken Burger', description: 'Grilled chicken breast with bacon, cheddar, smashed avocado and pico de gallo. Served with one side.', price: 18.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Pulled Pork Burger', description: 'Tender smoked pulled pork with coleslaw. Served with one side.', price: 17.95, category: 'Burgers', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },

  // ── Sandwiches & Wraps ──────────────────────────────────
  { name: 'Denver Style Sandwich', description: '2 scrambled eggs with ham, green onion, mushroom and mixed cheese on your choice of toast. Served with one side.', price: 15.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Montreal Smoked Reuben', description: 'Corned beef, sauerkraut, Swiss cheese and mustard on grilled rye. Served with one side.', price: 17.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Beef Dip', description: 'Slow braised chuck roast on ciabatta bread with in-house beer au jus. Served with one side.', price: 16.5, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Steak Sandwich (6 oz)', description: '6 oz strip loin with garlic mushroom, served on grilled bread. Served with one side.', price: 19.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Philly Cheese Steak', description: 'Slow braised chuck roast with onion, peppers, mushroom and Swiss cheese on grilled ciabatta. Served with fries.', price: 18.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },
  { name: 'Tex-Mex Quesadilla', description: 'Large tortilla filled with onion, pepper, tomato, mixed cheese and Tex-Mex seasoning with chicken or beef. Served with salsa and sour cream.', price: 17.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Cuban Sandwich', description: 'BBQ pulled pork, ham, Swiss cheese, pickles and mustard on grilled ciabatta. Served with one side.', price: 17.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Chicken Caesar Wrap', description: 'Romaine, bacon bits, parmesan, breaded chicken and Caesar dressing. Served with one side.', price: 15.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Buffalo Chicken Wrap', description: 'Mixed lettuce, tomato, green onion, bacon bits, mixed cheese, breaded chicken with buffalo ranch dressing. Served with one side.', price: 16.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Riya\'s Special Honey Dill Wrap', description: 'Chicken breast, bacon strips, lettuce, tomato, carrot, mixed cheese, green onion and honey dill sauce. Served with one side.', price: 16.95, category: 'Sandwiches & Wraps', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },

  // ── Poutines ────────────────────────────────────────────
  { name: 'Prairie Pork Poutine', description: 'Fries, pulled pork, bacon, cheese curd, gravy, green onion.', price: 14.95, category: 'Poutines', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Original Poutine', description: 'Crispy fries, cheese curd and gravy.', price: 12.95, category: 'Poutines', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Butter Chicken Poutine', description: 'Fries, mixed cheese, chicken breast, butter chicken sauce.', price: 15.95, category: 'Poutines', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },
  { name: 'Dill Pickle Poutine', description: 'Fries, chopped dill pickle, bacon, green onion, cheese curd, gravy, ranch.', price: 15.95, category: 'Poutines', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Honey Hot Chicken Poutine', description: 'Fries, crispy chicken, honey hot sauce, cheese curd, tomato, green onion.', price: 16.95, category: 'Poutines', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Philly Cheese Steak Poutine', description: 'Fries, braised beef, sauteed onions, green peppers, cheese curd, gravy.', price: 16.95, category: 'Poutines', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Chicken Bacon Ranch Poutine', description: 'Fries, crispy chicken, bacon, cheese curd, gravy, ranch, green onion, tomato.', price: 16.95, category: 'Poutines', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },

  // ── Lighter Meals ───────────────────────────────────────
  { name: 'Veal Cutlet (1 pc)', description: 'Lightly breaded golden fried cutlet topped with mushroom and gravy. Served with potato and vegetables.', price: 17.95, category: 'Lighter Meals', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Veal Cutlet (2 pcs)', description: 'Lightly breaded golden fried cutlets topped with mushroom and gravy. Served with potato and vegetables.', price: 21.95, category: 'Lighter Meals', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Breaded Beef Liver (1 pc)', description: 'Golden fried liver with caramelized onion and gravy. Served with potato and vegetables.', price: 17.95, category: 'Lighter Meals', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Breaded Beef Liver (2 pcs)', description: 'Golden fried liver with caramelized onion and gravy. Served with potato and vegetables.', price: 21.95, category: 'Lighter Meals', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Fish and Chips', description: 'Light and crispy battered fish fillet served with tartar sauce and lemon wedge. Extra fish +$8.', price: 18, category: 'Lighter Meals', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },

  // ── Main Entrees ────────────────────────────────────────
  { name: 'Wild Trout with Lemon Garlic Butter', description: '6 oz wild trout from Reindeer Lake, Saskatchewan, pan seared with herbs, lemon, garlic and white wine. Salad to start, potato and vegetables.', price: 28.95, category: 'Main Entrees', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Braised Beef Plate', description: 'Slow braised, hand pulled chuck roast with rich gravy. Salad to start, potato and vegetables.', price: 27.95, category: 'Main Entrees', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Salmon Steak with Lemon Garlic Butter', description: '8 oz wild caught salmon fillet grilled with lemon garlic butter and herbs. Salad to start, potato and vegetables.', price: 29.95, category: 'Main Entrees', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'BBQ Back Ribs (Half Rack)', description: 'Tender braised baby back ribs with BBQ sauce. Salad to start, potato and vegetables.', price: 23.95, category: 'Main Entrees', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'BBQ Back Ribs (Full Rack)', description: 'Tender braised baby back ribs with BBQ sauce. Salad to start, potato and vegetables.', price: 29.95, category: 'Main Entrees', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: '10 oz Hamburger Steak', description: 'Homemade hamburger steak topped with caramelized onion and gravy. Salad to start, potato and vegetables.', price: 27.95, category: 'Main Entrees', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: '8 oz Rib Eye Steak', description: 'Charbroiled the way you like, served with peppercorn sauce. Salad to start, potato and vegetables.', price: 28.95, category: 'Main Entrees', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: '10 oz New York Steak', description: 'Charbroiled the way you like, served with peppercorn sauce. Salad to start, potato and vegetables.', price: 34.95, category: 'Main Entrees', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },

  // ── Pastas & Bowls ──────────────────────────────────────
  { name: 'Crispy Chicken Honey Garlic Alfredo', description: 'Fettuccine and crispy breaded chicken in a honey garlic cream sauce. Served with garlic toast.', price: 16.95, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Seafood Schezwan Penne', description: 'Shrimp, baby scallops, mussels, mushroom and penne in a creamy sriracha sauce. Served with garlic toast.', price: 19.75, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Steak Stroganoff', description: 'Sirloin bites, onion, peppers, mushroom and tortellini in a brandy peppercorn cream sauce. Served with garlic toast.', price: 19.75, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Butter Chicken Pasta', description: 'Mild-medium butter chicken sauce with chicken breast and penne. Served with naan bread.', price: 18.95, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Seafood Carbonara', description: 'Shrimp, scallops, mussels, mushroom, broccoli, bacon and green onion in a creamy white wine sauce with fettuccine. Served with garlic toast.', price: 19.75, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Cheezy Tortellini', description: 'Shrimp or chicken, peppers, onion, mushroom and cheese tortellini in a creamy white wine sauce. Served with garlic toast.', price: 19, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: [], image: '' },
  { name: 'Singaporean Style Stir Fry', description: 'Stir-fry vegetables and cashews in sesame oil with chicken, shrimp or sirloin bites; teriyaki, honey garlic, Thai chili or peanut sauce; on rice or soft noodles.', price: 17.95, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: ['Dairy-Free'], image: '' },
  { name: 'Butter Chicken Bowl', description: 'Authentic East Indian creamy tomato sauce with chicken. Served with rice and naan bread.', price: 19, category: 'Pastas & Bowls', isAvailable: true, isPopular: true, dietaryTags: [], image: '' },
  { name: 'Spicy Thai Curry', description: 'Kaffir lime and fish sauce Thai curry with coconut milk and chicken or shrimp. Served with naan bread.', price: 19.5, category: 'Pastas & Bowls', isAvailable: true, isPopular: false, dietaryTags: ['Dairy-Free'], image: '' },

  // ── Gluten Free ─────────────────────────────────────────
  { name: 'GF Breaded Wings', description: 'Pound of breaded wings with house dip. Dry: salt & pepper, lemon pepper, Cajun. Sauce: hot, teriyaki, sweet chili, BBQ.', price: 17.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Bone In Pork Ribs', description: 'Bone in pork ribs served with roasted garlic aioli.', price: 15.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Steak Bites', description: 'Marinated sirloin bites pan fried with garlic butter.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Spinach Dip', description: 'Spinach, artichokes, cream cheese and parmesan baked with mozzarella. Served with corn chips, carrot and celery sticks.', price: 19.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Cactus Cut Potatoes', description: 'Served with house dill dip.', price: 12.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Nachos', description: 'Tortilla chips with tomato, onion, peppers, jalapenos and mixed cheese. Served with salsa. Add chicken or beef +$5.', price: 14.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Chicken Tenders', description: 'Served with fries, yam fries, cactus cut or salad, and plum or honey dill sauce.', price: 17.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Loaded Potato Bacon Soup (Bowl)', description: 'Creamy potato soup topped with bacon, cheese and green onions.', price: 14.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Loaded Potato Bacon Soup (Cup)', description: 'Creamy potato soup topped with bacon, cheese and green onions.', price: 11.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Lobster Bisque (Bowl)', description: 'Rich and creamy lobster bisque with a hint of sherry.', price: 15.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Lobster Bisque (Cup)', description: 'Rich and creamy lobster bisque with a hint of sherry.', price: 12.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Soup of the Day (Bowl)', description: 'Made fresh daily with seasonal ingredients.', price: 11.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Soup of the Day (Cup)', description: 'Made fresh daily with seasonal ingredients.', price: 7.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Prairie Pork Poutine', description: 'Pulled pork, bacon, cheese curd, gravy, green onion.', price: 15.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Original Poutine', description: 'Crispy fries, cheese curd and gravy.', price: 13.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Butter Chicken Poutine', description: 'Fries, chicken, cheese blend, butter chicken sauce.', price: 16.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Dill Pickle Poutine', description: 'Fries, chopped dill pickle, bacon, green onion, cheese curds, gravy, ranch.', price: 16.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Honey Hot Chicken Poutine', description: 'Fries, crispy chicken, honey hot sauce, cheese curd, gravy, tomato, green onion.', price: 17.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Philly Cheese Steak Poutine', description: 'Fries, braised beef, sauteed onions, green peppers, cheese curd, gravy.', price: 17.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Chicken Bacon Ranch Poutine', description: 'Fries, crispy chicken, bacon, gravy, ranch, green onion.', price: 17.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Garden Salad (Large)', description: 'Mixed greens, tomato, cucumber, carrots and choice of dressing.', price: 15.5, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Garden Salad (Small)', description: 'Mixed greens, tomato, cucumber, carrots and choice of dressing.', price: 12.5, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Caesar Salad (Large)', description: 'Romaine, parmesan, bacon bits, lemon wedges with creamy Caesar dressing.', price: 16.5, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Caesar Salad (Small)', description: 'Romaine, parmesan, bacon bits, lemon wedges with creamy Caesar dressing.', price: 13.5, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Santa Fe Chicken Salad', description: 'Mixed greens, pico de gallo, mixed cheese, Cajun chicken breast, cucumber, peppers, red onion and chipotle ranch.', price: 19.25, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Country Steak Salad', description: '6 oz sirloin steak on mixed greens, tomato, cucumber, pepper, bacon bits, mixed cheese and ranch.', price: 23.45, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Spinach & Quinoa Salad', description: 'Spinach, quinoa, mixed nuts and greens with tomato, cranberry, roasted almonds and balsamic vinaigrette.', price: 20.45, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Asian Shrimp Salad', description: 'Mixed greens, grilled shrimp, tomato, cucumber, peppers, red onion and carrot with Asian sesame dressing.', price: 20.45, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Taco Mexican Salad', description: 'Lettuce, pico de gallo, peppers, green onion, mixed cheese and taco beef or chicken. Served with salsa and sour cream.', price: 18.45, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Bacon and Cheddar Burger', description: '6 oz beef patty, bacon, cheddar on a GF bun. Served with one side.', price: 17.5, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Mushroom Bacon Swiss Burger', description: '6 oz beef patty, bacon, mushrooms, Swiss cheese on a GF bun. Served with one side.', price: 17.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Loaded Burger', description: '6 oz beef patty, bacon, ham, mushrooms, cheddar and Swiss with a sunny side egg on a GF bun. Served with one side.', price: 22.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Korean BBQ Chicken Burger', description: 'Chicken breast, bacon, BBQ sauce and mozzarella on a GF bun. Served with one side.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Chicken Club Burger', description: 'Chicken breast, ham, bacon, Swiss cheese on a GF bun. Served with one side.', price: 18.25, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF BBQ Mozzarella Burger', description: 'Beef patty, bacon, BBQ sauce, mozzarella on a GF bun. Served with one side.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Santa Fe Chicken Burger', description: 'Grilled chicken breast, bacon, cheddar, mashed avocado and pico de gallo on a GF bun. Served with one side.', price: 19.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Pulled Pork Burger', description: 'Tender smoked pulled pork with coleslaw on a GF bun. Served with one side.', price: 17.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF BBQ Beef on Bun', description: 'Slow braised shredded beef with tangy BBQ sauce on a GF bun. Served with one side.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Denver Style Sandwich', description: '2 scrambled eggs with ham, green onion, mushroom and mixed cheese on grilled GF bread. Served with one side.', price: 16.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Reuben', description: 'Corned beef, sauerkraut, Swiss cheese and mustard on grilled GF bread. Served with one side.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Steak Sandwich', description: '6 oz striploin with mushroom on GF bread. Served with one side.', price: 19.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF BLT', description: 'Bacon, lettuce, tomato, cheddar and mayo on GF bread. Served with one side.', price: 13.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Cuban Sandwich', description: 'BBQ pulled pork, ham, Swiss cheese, pickle and mustard on a GF bun. Served with one side.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Grilled Cheese', description: 'Melted cheddar on grilled GF bread. Served with one side.', price: 12.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Stir-Fry Bowl', description: 'Stir-fry vegetables and cashews in sesame oil with chicken, shrimp or sirloin bites in teriyaki or Thai chili sauce on rice. Served with GF garlic toast.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Butter Chicken Bowl', description: 'Authentic East Indian creamy tomato sauce with chicken. Served with rice and GF garlic toast.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Thai Curry', description: 'Kaffir lime and fish sauce Thai curry with coconut milk and chicken or shrimp. Served with rice and GF garlic toast.', price: 19, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Chicken & Mushroom Penne', description: 'Grilled chicken and mushrooms in a creamy sauce with GF penne. Served with GF garlic toast.', price: 18.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Seafood Schezwan Penne', description: 'Shrimp, baby scallops, mussels, mushroom and GF penne in a creamy sriracha sauce. Served with GF garlic toast.', price: 20.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Butter Chicken Pasta', description: 'Butter chicken sauce with chicken breast and GF penne. Served with GF garlic toast.', price: 19.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Wild Trout with Lemon Garlic Butter', description: 'Reindeer Lake trout pan seared with lemon garlic butter. Soup or salad to start, vegetables and potato or rice.', price: 29.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Braised Beef Plate', description: 'Slow braised, hand pulled chuck roast with rich gravy. Soup or salad to start, potato and vegetables.', price: 28.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Salmon Steak with Lemon Garlic Butter', description: '8 oz wild caught salmon grilled with lemon garlic butter. Soup or salad to start, vegetables and potato or rice.', price: 30.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF BBQ Back Ribs (Half Rack)', description: 'Tender smoked baby back ribs with BBQ sauce. Soup or salad to start, potato and vegetables.', price: 24.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF BBQ Back Ribs (Full Rack)', description: 'Tender smoked baby back ribs with BBQ sauce. Soup or salad to start, potato and vegetables.', price: 30.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF 10 oz Hamburger Steak', description: 'Homemade hamburger steak with caramelized onions and gravy. Soup or salad to start, potato and vegetables.', price: 28.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF 8 oz Rib Eye Steak', description: 'Charbroiled the way you like, with peppercorn sauce. Soup or salad to start, potato and vegetables.', price: 29.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF 10 oz New York Steak', description: 'Cooked to your liking, with peppercorn sauce. Soup or salad to start, potato and vegetables.', price: 35.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
  { name: 'GF Fish and Chips', description: 'Light and crispy battered fish filet with tartar sauce and lemon wedge. Extra fish +$9.', price: 20.95, category: 'Gluten Free', isAvailable: true, isPopular: false, dietaryTags: ['Gluten-Free'], image: '' },
];

// ── Default add-ons / choices (editable later in Admin → Menu Items) ──
const opt = (name, price = 0) => ({ name, price });
const SIDES = ['Fries', 'Yam Fries', 'Onion Rings', 'Cactus Cut'].map(n => opt(n));
const SIDE_UPGRADES = [opt('Upgrade to Poutine', 3), opt('Upgrade to Caesar Salad', 2), opt('Upgrade to Potato Soup', 3), opt('Upgrade to Lobster Bisque', 3)];
const POTATO = ['Fries', 'Yam Fries', 'Onion Rings', 'Cactus Cut', 'Mashed', 'Stuffed Potato', 'Rice'].map(n => opt(n));
const DONENESS = { name: 'How would you like it cooked?', required: true, maxSelect: 1, options: ['Rare', 'Medium Rare', 'Medium', 'Medium Well', 'Well Done'].map(n => opt(n)) };
const ADD_CHICKEN = { name: 'Extras', required: false, maxSelect: 0, options: [opt('Add Chicken', 5)] };

function defaultOptions(item) {
  const groups = [];
  const n = item.name;
  const gf = item.category === 'Gluten Free';
  if (/Burger/.test(n)) {
    groups.push({ name: 'Choose a Side', required: true, maxSelect: 1, options: [...SIDES, opt('Garden Salad'), opt('Soup of the Day'), ...SIDE_UPGRADES] });
    if (!/Chicken|Pork/.test(n)) groups.push({ name: 'Extras', required: false, maxSelect: 0, options: [opt('Extra Patty', 4.95)] });
  } else if (item.category === 'Sandwiches & Wraps' && !/Philly|Quesadilla/.test(n) || gf && /Sandwich|Reuben|BLT|Grilled Cheese|on Bun/.test(n)) {
    groups.push({ name: 'Choose a Side', required: true, maxSelect: 1, options: [...SIDES, opt('Garden Salad'), opt('Soup of the Day'), ...SIDE_UPGRADES] });
  }
  if (item.category === 'Lighter Meals' || item.category === 'Main Entrees' || gf && /Trout|Beef Plate|Salmon|Ribs \(|Hamburger Steak|Steak$/.test(n) && !/Sandwich/.test(n)) {
    groups.push({ name: 'Choose Potato', required: true, maxSelect: 1, options: POTATO });
  }
  if (/Rib Eye|New York|Steak Salad|Steak Sandwich/.test(n)) groups.push(DONENESS);
  if (/Wings/.test(n)) {
    groups.push({ name: 'Flavour', required: true, maxSelect: 1, options: ['Salt & Pepper', 'Lemon Pepper', 'Cajun', 'Hot', 'Teriyaki', 'Honey Garlic', 'Sweet Chili', 'BBQ'].filter(f => !(gf && f === 'Honey Garlic')).map(f => opt(f)) });
  }
  if (/Chicken Fingers|Chicken Tenders/.test(n)) {
    groups.push({ name: 'Choose a Side', required: true, maxSelect: 1, options: SIDES });
    groups.push({ name: 'Dipping Sauce', required: true, maxSelect: 1, options: [opt('Plum'), opt('Honey Dill')] });
  }
  if (/Quesadilla|Taco|Tortellini|Thai Curry/.test(n)) {
    const choices = /Tortellini|Thai Curry/.test(n) ? ['Chicken', 'Shrimp'] : ['Chicken', 'Beef'];
    groups.push({ name: 'Choose Protein', required: true, maxSelect: 1, options: choices.map(c => opt(c)) });
  }
  if (/Stir/.test(n)) {
    groups.push({ name: 'Choose Protein', required: true, maxSelect: 1, options: ['Chicken', 'Shrimp', 'Sirloin Bites'].map(c => opt(c)) });
    groups.push({ name: 'Choose Sauce', required: true, maxSelect: 1, options: (gf ? ['Teriyaki', 'Thai Chili'] : ['Teriyaki', 'Honey Garlic', 'Thai Chili', 'Asian Peanut']).map(c => opt(c)) });
    if (!gf) groups.push({ name: 'Rice or Noodles', required: true, maxSelect: 1, options: [opt('Rice'), opt('Soft Noodles')] });
  }
  if (/Nachos/.test(n)) groups.push({ name: 'Extras', required: false, maxSelect: 0, options: [opt('Add Chicken', 5), opt('Add Beef', 5)] });
  if (/^(GF )?(Garden|Caesar) Salad/.test(n)) {
    groups.push({ name: 'Dressing', required: /Garden/.test(n), maxSelect: 1, options: ['Ranch', 'Italian', '1000 Island', 'Balsamic', 'French', 'Blue Cheese'].map(d => opt(d)) });
    groups.push(ADD_CHICKEN);
  }
  if (/Fish and Chips/.test(n)) groups.push({ name: 'Extras', required: false, maxSelect: 0, options: [opt('Extra Fish', gf ? 9 : 8)] });
  if (item.category === 'Pastas & Bowls' && !/Bowl|Curry|Stir/.test(n)) {
    groups.push({ name: 'Extras', required: false, maxSelect: 0, options: [opt('Upgrade to Cheese Toast', 1.25), opt('Baked with Cheese', 3)] });
  }
  return groups;
}
// ── Stock photos (Unsplash) — replace with real dish photos in Admin → Menu Items ──
const img = id => `https://images.unsplash.com/photo-${id}?w=600&q=80`;
const IMAGE_RULES = [
  [/Wings/, ['1608039755401-742074f0548d', '1527477396000-e27163b481c2']],
  [/Rib/, ['1544025162-d76694265947']],
  [/Steak Bites|Stroganoff/, ['1558030006-450675393462']],
  [/Steak Sandwich|Reuben|Denver|Cuban|BLT|Beef Dip/, ['1553909489-cd47e0907980', '1528735602780-2552fd46c7af']],
  [/Grilled Cheese/, ['1528736235302-52922df5c122']],
  [/Philly Cheese Steak$/, ['1528735602780-2552fd46c7af']],
  [/Poutine|Fries|Cactus/, ['1573080496219-bb080dd4f877', '1630384060421-cb20d0e0649d']],
  [/Onion Rings|Pickles|Calamari/, ['1639024471283-03518883512d']],
  [/Nachos|Spinach Dip/, ['1513456852971-30c0b8199d4d', '1582169296194-e4d644c48063']],
  [/Chicken Fingers|Chicken Tenders|Veal|Liver/, ['1562967914-608f82629710']],
  [/Fish and Chips|Trout/, ['1485921325833-c519f76c4927']],
  [/Salmon/, ['1467003909585-2f8a72700288']],
  [/Rib Eye|New York|Hamburger Steak|Braised Beef|Steak Salad/, ['1600891964092-4316c288032e', '1558030006-450675393462']],
  [/Burger|on Bun/, ['1568901346375-23c9450c58cd', '1553979459-d2229ba7433b', '1571091718767-18b5b1457add']],
  [/Quesadilla/, ['1618040996337-56904b7850b9']],
  [/Wrap/, ['1626700051175-6818013e1d4f']],
  [/Caesar/, ['1550304943-4f24f54ddde9', '1546793665-c74683f339c1']],
  [/Salad/, ['1512621776951-a57141f2eefd', '1540420773420-3366772f4999']],
  [/Lobster Bisque/, ['1547592166-23ac45744acd']],
  [/Potato Bacon Soup/, ['1594756202469-9ff9799b2e4e']],
  [/Soup/, ['1603105037880-880cd4edfb0d']],
  [/Butter Chicken/, ['1603894584373-5ac82b2ae398']],
  [/Thai Curry/, ['1455619452474-d2be8b1e70cd']],
  [/Stir/, ['1512058564366-18510be2db19']],
  [/Seafood/, ['1563379926898-05f4575a45d8']],
  [/Alfredo|Tortellini|Mushroom Penne/, ['1645112411341-6c4fd023714a', '1473093295043-cdd812d0e601']],
  [/Penne|Carbonara|Pasta/, ['1621996346565-e3dbc646d9a9']],
];
const ruleUse = new Map();
function stockImage(name) {
  const rule = IMAGE_RULES.find(([re]) => re.test(name));
  if (!rule) return '';
  const n = ruleUse.get(rule) || 0; // rotate so neighbouring items don't all look identical
  ruleUse.set(rule, n + 1);
  return img(rule[1][n % rule[1].length]);
}

MENU_ITEMS.forEach(item => {
  item.optionGroups = defaultOptions(item);
  if (!item.image) item.image = stockImage(item.name);
});

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
    if (process.argv.includes('--reset')) {
      const { deletedCount } = await MenuItem.deleteMany({});
      console.log(`🗑️  Removed ${deletedCount} existing menu items`);
    }
    const count = await MenuItem.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Menu already has ${count} items — skipping menu seed.`);
      console.log('   (Run `node seed.js --reset` to replace the existing menu)');
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