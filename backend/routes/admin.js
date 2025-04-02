import express from 'express';
import {
  createAdmin,
  loginAdmin,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admin.js';

const router = express.Router();

router.post('/create', createAdmin);
router.post('/login', loginAdmin);
router.put('/update/:adminId', updateAdmin);
router.delete('/delete/:adminId', deleteAdmin);

export default router;