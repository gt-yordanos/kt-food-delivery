import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
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
router.put('/update-account/:customerId', authenticateToken, authorizeRoles(['admin', 'customer']), updateAccount);
router.delete('/delete-account/:customerId', authenticateToken, authorizeRoles(['admin', 'customer']), deleteAccount);
router.get('/customer-info/:customerId', authenticateToken, authorizeRoles(['admin', 'customer', 'manager', 'deliveryPerson']), getCustomerInfo);
router.get('/all-customers', authenticateToken, authorizeRoles(['admin']), getAllCustomers);
router.get('/search-customer', authenticateToken, authorizeRoles(['admin']), searchCustomerByName);

export default router;