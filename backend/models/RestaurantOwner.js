import mongoose from 'mongoose';

const restaurantOwnerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,  // Now required
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RestaurantOwner = mongoose.model('RestaurantOwner', restaurantOwnerSchema);

export { RestaurantOwner };