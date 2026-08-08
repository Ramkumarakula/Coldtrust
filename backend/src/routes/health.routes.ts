import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

router.get('/', healthController.getSystemHealth);
router.get('/blockchain', healthController.getBlockchainHealth);
router.get('/database', healthController.getDatabaseHealth);

export default router;
