import axios from 'axios';
import { Order } from '../models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_AUTH = process.env.CHAPA_AUTH;
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`
  }
};

export const initializePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email, firstName, lastName } = req.body;

    const order = await Order.findById(orderId).populate('customer');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Unique reference for the transaction
    const txRef = `tx-santim-${orderId}-${Date.now()}`;

    const data = {
      amount: order.totalPrice.toString(),
      currency: 'ETB',
      email: email || order.customer.email,
      first_name: firstName || order.customer.firstName,
      last_name: lastName || order.customer.lastName,
      tx_ref: txRef,
      callback_url: `${BASE_URL}/api/payments/verify/${txRef}`,
      return_url: `${BASE_URL}/api/payments/success/${orderId}`
    };

    const response = await axios.post(CHAPA_URL, data, config);
    
    // Update order with payment reference
    order.paymentReference = txRef;
    await order.save();

    res.json({ checkoutUrl: response.data.data.checkout_url });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ message: 'Error initializing payment' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;

    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, config);
    
    // Find order by payment reference
    const order = await Order.findOne({ paymentReference: txRef });
    if (order) {
      order.paymentStatus = 'verified';
      order.status = 'inProgress'; // Move to next status
      await order.save();
    }

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // You might want to update order status here as well
    order.paymentStatus = 'success';
    await order.save();

    res.status(200).json({ message: 'Payment successful', order });
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).json({ message: 'Error processing payment success' });
  }
};