import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import heroSectionRoutes from './hero-section.routes';

const router = Router();

router.use(healthRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/hero-section', heroSectionRoutes);

export default router;
