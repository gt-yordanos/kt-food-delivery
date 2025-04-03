import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "My Awesome Restaurant",
  },
  about: {
    type: String,
    required: true,
    default: "Serving delicious food since 2024!",
  },
  address: {
    type: String,
    required: true,
    default: "123 Main Street, Food City",
  },
  phone: {
    type: String,
    required: true,
    default: "+1234567890",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "contact@restaurant.com",
  },
  openingHours: {
    monday: { type: String, required: true, default: "9:00 AM - 10:00 PM" },
    tuesday: { type: String, required: true, default: "9:00 AM - 10:00 PM" },
    wednesday: { type: String, required: true, default: "9:00 AM - 10:00 PM" },
    thursday: { type: String, required: true, default: "9:00 AM - 10:00 PM" },
    friday: { type: String, required: true, default: "9:00 AM - 11:00 PM" },
    saturday: { type: String, required: true, default: "10:00 AM - 11:00 PM" },
    sunday: { type: String, required: true, default: "10:00 AM - 9:00 PM" },
  },
  socialLinks: {
    facebook: { type: String, default: "https://facebook.com/myrestaurant" },
    twitter: { type: String, default: "https://twitter.com/myrestaurant" },
    instagram: { type: String, default: "https://instagram.com/myrestaurant" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent multiple instances of the restaurant
restaurantSchema.pre('save', async function (next) {
  const existingRestaurant = await mongoose.models.Restaurant.findOne();
  if (existingRestaurant && existingRestaurant._id.toString() !== this._id.toString()) {
    throw new Error('Only one restaurant instance is allowed.');
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export { Restaurant };