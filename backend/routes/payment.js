import express from 'express';
import {
  initializePayment,
  verifyPayment,
  paymentSuccess
} from '../controllers/payment.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize/:orderId', authenticateToken, initializePayment);
router.get('/verify/:txRef', verifyPayment);
router.get('/success/:orderId', authenticateToken, paymentSuccess);

export default router;