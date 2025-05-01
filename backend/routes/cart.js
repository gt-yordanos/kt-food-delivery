import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.js';

const router = express.Router();

router.post('/add', authenticateToken, addToCart);
router.get('/', authenticateToken, getCart);
router.delete('/remove/:menuId', authenticateToken, removeFromCart);

export default router;
