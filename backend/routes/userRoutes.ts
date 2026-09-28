import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile', verifyAuth, UserController.getProfile);
router.put('/profile', verifyAuth, UserController.updateProfile);

export default router;
