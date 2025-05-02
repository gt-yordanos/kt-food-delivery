import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_AUTH = process.env.CHAPA_AUTH;
const BASE_URL = process.env.BASE_URL || "http://localhost:2200";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`
  }
};

export const initializeChapaPayment = async (order, customer) => {
  const txRef = `tx-santim-${order._id}-${Date.now()}`;

  const data = {
    amount: order.totalPrice.toString(),
    currency: 'ETB',
    email: customer.email,
    first_name: customer.firstName,
    last_name: customer.lastName,
    tx_ref: txRef,
    callback_url: `${BASE_URL}/api/orders/verify-payment/${txRef}`,
    return_url: `${FRONTEND_URL}/order-success/${order._id}` // Redirect to frontend success page
  };

  const response = await axios.post(CHAPA_URL, data, config);
  
  return {
    checkoutUrl: response.data.data.checkout_url,
    txRef
  };
};

export const verifyChapaPayment = async (txRef) => {
  const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, config);
  return response.data;
};