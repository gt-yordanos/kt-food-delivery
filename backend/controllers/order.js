import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';

// Create a new order (Only customers)
export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can place orders' });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const newOrder = new Order({
      customer: req.user.id,
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

// Get all orders (Only Admins & Restaurant Owners)
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

// Track order status (Only the customer who placed the order)
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('customer', 'name email')
      .populate('items.menuId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only track your own orders' });
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