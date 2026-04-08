import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import portfolioContentRoutes from './portfolio-content.routes';

const router = Router();

router.use(healthRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/portfolio-content', portfolioContentRoutes);

export default router;
