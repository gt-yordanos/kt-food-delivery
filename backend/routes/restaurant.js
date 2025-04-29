import express from 'express';
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getAvailableMenuItems,
  getMenuItemById,
  getAvailableMenuItemById,
  getMenuByCategory,
  getAvailableMenuByCategory,
  searchMenuByName,
  searchAvailableMenuByName
} from '../controllers/menuController.js';

import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/menu', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), addMenuItem);
router.put('/menu/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateMenuItem);
router.delete('/menu/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), deleteMenuItem);

router.get('/menu', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getAllMenuItems);
router.get('/menu/search', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), searchMenuByName);

router.get('/menu/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']),  getMenuItemById);
router.get('/menu/category/:category', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getMenuByCategory);

router.get('/menu/available', getAvailableMenuItems);
router.get('/menu/available/search', searchAvailableMenuByName);

router.get('/menu/available/:menuId', getAvailableMenuItemById);
router.get('/menu/available/category/:category', getAvailableMenuByCategory);

export default router;