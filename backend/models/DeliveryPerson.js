import mongoose from 'mongoose';

const deliveryPersonSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  campus: {
    type: String,
    enum: ['Main', 'HiT', 'CVM'], // Enum for campus
    required: true,
  },
  deliveries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery', // Reference to Delivery model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema);

export { DeliveryPerson };