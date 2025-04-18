import express from 'express'; 
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'; 
import { upload } from '../config/upload.js'; 
import { addMenuItem, updateMenuItem, deleteMenuItem, getAllMenuItems, getMenuByCategory, searchMenuByName } from '../controllers/menu.js'; 

const router = express.Router(); 

router.post('/add-menu-item', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), upload.single('image'), addMenuItem); 
router.put('/update-menu-item/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), upload.single('image'), updateMenuItem); 
router.delete('/delete-menu-item/:menuId', authenticateToken, authorizeRoles(['admin', 'restaurantOwner']), deleteMenuItem); 
router.get('/menu-items', getAllMenuItems); 
router.get('/menu-items/category/:category', getMenuByCategory); 

export default router;
