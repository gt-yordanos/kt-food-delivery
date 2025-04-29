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
  searchAvailableMenuByName,
  updateMenuItemAvailability
} from '../controllers/menu.js';

import { upload } from '../config/upload.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  upload.single('image'),
  addMenuItem
);

router.put(
  '/:menuId',
  authenticateToken,
  authorizeRoles(['admin', 'restaurantOwner']),
  upload.single('image'),
  updateMenuItem
);

router.delete('/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), deleteMenuItem);

router.get('/', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getAllMenuItems);
router.get('/search', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), searchMenuByName);
router.get('/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getMenuItemById);
router.get('/category/:category', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), getMenuByCategory);

router.get('/available', getAvailableMenuItems);
router.get('/available/search', searchAvailableMenuByName);
router.get('/available/:menuId', getAvailableMenuItemById);
router.get('/available/category/:category', getAvailableMenuByCategory);

router.put('/update-availability/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateMenuItemAvailability);

export default router;