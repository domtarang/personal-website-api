import { Router } from 'express';
import asyncHandler from '../utils/async-handler';
import authenticate from '../middleware/authenticate';
import validateRequest from '../middleware/validate-request';
import * as authController from '../controllers/auth.controller';
import authRateLimit from '../middleware/auth-rate-limit';
import { validateLoginBody, validatePasswordUpdateBody } from '../validators/auth.validator';

const router = Router();

router.post('/login', authRateLimit, validateRequest(validateLoginBody), asyncHandler(authController.login));
router.get('/session', asyncHandler(authenticate), asyncHandler(authController.getSession));
router.post('/logout', asyncHandler(authenticate), asyncHandler(authController.logout));
router.put(
  '/password',
  asyncHandler(authenticate),
  validateRequest(validatePasswordUpdateBody),
  asyncHandler(authController.updatePassword),
);

export default router;
