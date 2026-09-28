import { Router } from 'express';
import { TestController } from '../controllers/testController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', TestController.getTests);
router.get('/:id', TestController.getTestById);
router.post('/', verifyAdmin, TestController.createTest);
router.put('/:id', verifyAdmin, TestController.updateTest);
router.delete('/:id', verifyAdmin, TestController.deleteTest);

export default router;
