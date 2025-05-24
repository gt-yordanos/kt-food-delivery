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

// Protected routes (admin/owner)
router.post(
  '/',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  upload.single('image'),
  addMenuItem
);

router.put(
  '/:menuId',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  upload.single('image'),
  updateMenuItem
);

router.delete(
  '/:menuId',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  deleteMenuItem
);

router.get(
  '/',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  getAllMenuItems
);

router.get(
  '/search',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  searchMenuByName
);

router.get(
  '/category/:category',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  getMenuByCategory
);

// Public available routes (IMPORTANT ORDER)
router.get('/available/search', searchAvailableMenuByName);
router.get('/available/category/:category', getAvailableMenuByCategory);
router.get('/available', getAvailableMenuItems); // <- must be BEFORE /available/:menuId
router.get('/available/:menuId', getAvailableMenuItemById); // <- LAST in the available group

router.put(
  '/update-availability/:menuId',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  updateMenuItemAvailability
);

// Final catch: this should be LAST
router.get('/:menuId',
  authenticateToken,
  authorizeRoles(['admin', 'manager']),
  getMenuItemById
);

export default router;