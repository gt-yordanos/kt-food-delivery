import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { customerId, items, totalPrice } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const newOrder = new Order({
      customer: customerId,
      items,
      totalPrice,
    });

    await newOrder.save();

    customer.orderHistory.push({
      orderId: newOrder._id,
      totalPrice,
      status: 'pending',
    });
    await customer.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.menuId');

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Track order status
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('customer', 'name email')
      .populate('items.menuId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to track order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};