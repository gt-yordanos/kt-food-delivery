import mongoose from 'mongoose';

const deliveryPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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