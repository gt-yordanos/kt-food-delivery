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
} from '../controllers/menuController.js';

import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/menu', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), addMenuItem);
router.put('/menu/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateMenuItem);
router.delete('/menu/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), deleteMenuItem);

router.get('/menu', getAllMenuItems);
router.get('/menu/search', searchMenuByName);

router.get('/menu/:menuId', getMenuItemById);
router.get('/menu/category/:category', getMenuByCategory);

router.get('/menu/available', getAvailableMenuItems);
router.get('/menu/available/search', searchAvailableMenuByName);

router.get('/menu/available/:menuId', getAvailableMenuItemById);
router.get('/menu/available/category/:category', getAvailableMenuByCategory);

router.put('/update-availability/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), updateMenuItemAvailability);

export default router;