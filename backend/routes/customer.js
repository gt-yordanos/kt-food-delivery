import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import {
  signUp,
  logIn,
  logOut,
  updateAccount,
  deleteAccount,
  getCustomerInfo,
  getAllCustomers,
  searchCustomerByName,
} from '../controllers/customer.js';

const router = express.Router();
router.post('/sign-up', signUp);
router.post('/log-in', logIn);
router.post('/log-out', authenticateToken, logOut);
router.put('/update-account', authenticateToken, authorizeRole(['admin', 'customer']), updateAccount);
router.delete('/delete-account', authenticateToken, authorizeRole(['admin', 'customer']), deleteAccount);
router.get('/customer-info', authenticateToken, authorizeRole(['admin', 'customer', 'restaurantOwner', 'deliveryPerson']), getCustomerInfo);
router.get('/all-customers', authenticateToken, authorizeRole(['admin']), getAllCustomers);
router.get('/search-customer', authenticateToken, authorizeRole(['admin']), searchCustomerByName);

export default router;