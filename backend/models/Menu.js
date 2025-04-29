import mongoose from 'mongoose';

// Shortened food categories enum
const foodCategories = [
  'Injera Dishes',
  'Vegetarian',
  'Grilled Meats',
  'Soups & Stews',
  'Breakfast',
  'Snacks & Street Food',
  'Beverages',
  'Salads & Sides',
  'Desserts',
  'Fast Food',
];

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  category: {
    type: [String],
    enum: foodCategories,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Menu = mongoose.model('Menu', menuSchema);

export { Menu };