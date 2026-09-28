import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', verifyAdmin, UserController.getAdminStats);
router.get('/users', verifyAdmin, UserController.getAdminUsers);

export default router;
