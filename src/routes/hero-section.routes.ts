import { Router } from 'express';
import asyncHandler from '../utils/async-handler';
import authenticate from '../middleware/authenticate';
import validateRequest from '../middleware/validate-request';
import * as heroSectionController from '../controllers/hero-section.controller';
import { validateHeroSectionBody } from '../validators/hero-section.validator';

const router = Router();

router.get('/', asyncHandler(heroSectionController.getHeroSection));
router.put(
  '/',
  asyncHandler(authenticate),
  validateRequest(validateHeroSectionBody),
  asyncHandler(heroSectionController.updateHeroSection),
);

export default router;
