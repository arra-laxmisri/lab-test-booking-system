import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', verifyAuth, AuthController.getMe);

export default router;
