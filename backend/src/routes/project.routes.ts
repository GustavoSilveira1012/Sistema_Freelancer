import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authMiddleware } from '../middlewares/auth.middlewares';

const router = Router();
const controller = new ProjectController();

router.use(authMiddleware); // ← protege TODAS as rotas

router.get('/', controller.findAll.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;