import { Order } from '../models/Order.js';
import { verifyChapaPayment } from '../services/chapaService.js';
import { Customer } from '../models/Customer.js';

export const checkPendingPayments = async () => {
  try {
    const pendingOrders = await Order.find({ paymentStatus: 'pending' });

    if (!pendingOrders.length) return;

    for (const order of pendingOrders) {
      try {
        const tx_ref = order.paymentReference;
        if (!tx_ref) continue;

        const paymentVerification = await verifyChapaPayment(tx_ref);

        if (paymentVerification.status === 'success') {
          order.paymentStatus = 'paid';
          order.status = 'inProgress';
          await order.save();

          const customer = await Customer.findById(order.customer);
          if (customer) {
            const orderHistoryItem = customer.orderHistory.find(
              (item) => item.orderId.toString() === order._id.toString()
            );
            if (orderHistoryItem) {
              orderHistoryItem.status = 'inProgress';
              await customer.save();
            }
          }
        }
      } catch (error) {
        // Continue with next order even if one fails
      }
    }
  } catch (error) {
    // Handle unexpected top-level error
  }
};