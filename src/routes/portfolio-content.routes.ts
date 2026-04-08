import { Router } from 'express';
import asyncHandler from '../utils/async-handler';
import authenticate from '../middleware/authenticate';
import validateRequest from '../middleware/validate-request';
import * as portfolioContentController from '../controllers/portfolio-content.controller';
import { validatePortfolioContentBody } from '../validators/portfolio-content.validator';

const router = Router();

router.get('/', asyncHandler(portfolioContentController.getPortfolioContent));
router.put(
  '/',
  asyncHandler(authenticate),
  validateRequest(validatePortfolioContentBody),
  asyncHandler(portfolioContentController.updatePortfolioContent),
);

export default router;
