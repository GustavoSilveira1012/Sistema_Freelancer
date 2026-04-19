import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authMiddleware } from '../middlewares/auth.middlewares';

const router = Router();
const controller = new ActivityController();

router.use(authMiddleware);
router.get('/', controller.findAll.bind(controller));

export default router;