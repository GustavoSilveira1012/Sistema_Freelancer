import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middlewares';

const router = Router();
const controller = new TaskController();

router.use(authMiddleware); // ← protege TODAS as rotas

router.get('/', controller.findAll.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;