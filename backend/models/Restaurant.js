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
    required: true,  // Renamed contact to phone
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensuring email is unique
  },
  openingHours: {
    monday: {
      type: String,  // Format: '9:00 AM - 5:00 PM'
      required: true,
    },
    tuesday: {
      type: String,
      required: true,
    },
    wednesday: {
      type: String,
      required: true,
    },
    thursday: {
      type: String,
      required: true,
    },
    friday: {
      type: String,
      required: true,
    },
    saturday: {
      type: String,
      required: true,
    },
    sunday: {
      type: String,
      required: true,
    },
  },
  socialLinks: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,  // Changed from 'x' to 'twitter' for clarity
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,  // Added LinkedIn for example
    },
    youtube: {
      type: String,  // Added YouTube for example
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export { Restaurant };