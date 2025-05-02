import { Order } from '../models/Order.js';
import { Menu } from '../models/Menu.js';
import { Customer } from '../models/customer.js';
import { initializeChapaPayment, verifyChapaPayment } from './payment.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const customerId = req.id;
    const { items, campus, building, roomNumber, paymentMethod } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const menu = await Menu.findById(item.menuId);
      if (!menu || !menu.available) {
        return res.status(400).json({ message: `Menu item not found or unavailable: ${item.menuId}` });
      }

      const itemTotal = menu.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        menuId: menu._id,
        name: menu.name,
        priceAtPurchase: menu.price,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      customer: customerId,
      items: orderItems,
      totalPrice,
      campus,
      building,
      roomNumber,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'success' : 'pending'
    });

    customer.orderHistory.push({
      orderId: order._id,
      totalPrice,
      status: order.status,
    });
    await customer.save();

    if (paymentMethod === 'chapa') {
      try {
        const paymentResponse = await initializeChapaPayment(order, customer);
        return res.status(201).json({ 
          order, 
          checkoutUrl: paymentResponse.checkoutUrl 
        });
      } catch (error) {
        console.error('Payment initialization error:', error);
        order.paymentStatus = 'failed';
        await order.save();
        return res.status(201).json({ 
          order,
          message: 'Order created but payment initialization failed' 
        });
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Verify payment (Chapa webhook)
export const verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;
    const paymentData = await verifyChapaPayment(txRef);
    
    const order = await Order.findOne({ paymentReference: txRef });
    if (order) {
      order.paymentStatus = 'verified';
      if (order.status === 'pending') {
        order.status = 'inProgress';
      }
      await order.save();
    }

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

// Payment success redirect
export const paymentSuccessRedirect = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'success';
    if (order.status === 'pending') {
      order.status = 'inProgress';
    }
    await order.save();

    // Redirect to frontend success page with order ID
    res.redirect(`${process.env.FRONTEND_URL}/order-success/${orderId}`);
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
  }
};

// Get all orders (FIFO)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: 1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get orders by customer ID
export const getOrdersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customer: customerId })
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders' });
  }
};

// Get orders by status (FIFO)
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const orders = await Order.find({ status })
      .populate('customer', 'firstName lastName')
      .sort({ createdAt: 1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders by status' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'inProgress', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};