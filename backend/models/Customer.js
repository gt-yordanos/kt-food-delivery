import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const customerSchema = new mongoose.Schema({
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
  cart: [cartSchema],
  address: {
    type: String,
    required: true,
  },
  orderHistory: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      orderDate: {
        type: Date,
        default: Date.now,
      },
      totalPrice: Number,
      status: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Fix for OverwriteModelError
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export { Customer };