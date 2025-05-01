import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'inProgress', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      type: String,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Fix for OverwriteModelError
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export { Order };