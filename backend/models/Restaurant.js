import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  openingHours: {
    monday: { type: String, required: true },
    tuesday: { type: String, required: true },
    wednesday: { type: String, required: true },
    thursday: { type: String, required: true },
    friday: { type: String, required: true },
    saturday: { type: String, required: true },
    sunday: { type: String, required: true },
  },
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    tiktok: { type: String },
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