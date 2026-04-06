import { Router } from 'express';
import asyncHandler from '../utils/async-handler';
import * as healthController from '../controllers/health.controller';

const router = Router();

router.get('/', healthController.getRoot);
router.get('/api/health', asyncHandler(healthController.getHealth));

export default router;
