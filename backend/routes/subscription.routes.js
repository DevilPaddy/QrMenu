import { Router } from 'express';
import {
  createSubscription,
  cancelSubscription,
  getMySubscriptions,
} from '../controllers/subscription.controller.js';

import { verifyToken } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Super-admin...
router.post('/', verifyToken, isAdmin, createSubscription);
router.patch('/:id/cancel', verifyToken, isAdmin, cancelSubscription);

//User...
router.get('/me', verifyToken, getMySubscriptions);

export default router;
