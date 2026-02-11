import { Router } from 'express';
import {
  createSubscription,
  cancelSubscription,
  getMySubscriptions,
} from '../controllers/subscription.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/auth.middleware.js';
import { 
  validateCreateSubscription,
  validateIdParam 
} from '../middleware/validation.middleware.js';

const router = Router();

// Super-admin...
router.post('/', verifyToken, isAdmin, validateCreateSubscription, createSubscription);
router.patch('/:id/cancel', verifyToken, isAdmin, validateIdParam, cancelSubscription);

//User...
router.get('/me', verifyToken, getMySubscriptions);

export default router;
