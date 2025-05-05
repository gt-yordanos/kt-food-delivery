import { Order } from '../models/Order.js';
import { verifyChapaPayment } from '../services/chapaService.js';
import { Customer } from '../models/Customer.js';

export const checkPendingPayments = async () => {
  try {
    const pendingOrders = await Order.find({ paymentStatus: 'pending' });

    for (const order of pendingOrders) {
      const tx_ref = order.paymentReference;
      const paymentVerification = await verifyChapaPayment(tx_ref);

      if (paymentVerification.status === 'success') {
        order.paymentStatus = 'paid';
        order.status = 'inProgress';
        await order.save();

        // Update customer's order history
        const customer = await Customer.findById(order.customer);
        if (customer) {
          const orderHistoryItem = customer.orderHistory.find(
            (item) => item.orderId.toString() === order._id.toString()
          );
          if (orderHistoryItem) {
            orderHistoryItem.status = 'inProgress';
          }
          await customer.save();
        }

        console.log(`✅ Order ${order._id} marked as paid and inProgress`);
      }
    }
  } catch (error) {
    console.error('❌ Error checking pending payments:', error.message);
  }
};