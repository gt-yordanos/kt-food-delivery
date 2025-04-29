import mongoose from 'mongoose';

const timeRangeSchema = new mongoose.Schema({
  start: { type: String, required: true }, // Format: "HH:mm"
  end: { type: String, required: true },   // Format: "HH:mm"
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  about: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  openingHours: {
    monday: { type: timeRangeSchema, required: true },
    tuesday: { type: timeRangeSchema, required: true },
    wednesday: { type: timeRangeSchema, required: true },
    thursday: { type: timeRangeSchema, required: true },
    friday: { type: timeRangeSchema, required: true },
    saturday: { type: timeRangeSchema, required: true },
    sunday: { type: timeRangeSchema, required: true },
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

// Ensure only one restaurant instance exists
restaurantSchema.pre('save', async function (next) {
  const existing = await mongoose.models.Restaurant.findOne();
  if (existing && existing._id.toString() !== this._id.toString()) {
    throw new Error('Only one restaurant instance is allowed.');
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export { Restaurant };