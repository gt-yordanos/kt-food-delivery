import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true, // Ensures one delivery per order
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPerson',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'inProgress', 'delivered'],
    default: 'pending',
  },
  deliveredAt: Date,
  customerVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Delivery = mongoose.model('Delivery', deliverySchema);
export { Delivery };