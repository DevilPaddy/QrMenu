import { Router } from 'express';
import {
  createSubscription,
  cancelSubscription,
  getMySubscriptions,
} from '../controllers/subscription.controller.js';

import { requireAuth } from '../middleware/requireAuth.js';
import { requireSuperAdmin } from '../middleware/requireSuperAdmin.js';

const router = Router();

// Super-admin...
router.post('/', requireAuth, requireSuperAdmin, createSubscription);
router.patch('/:id/cancel', requireAuth, requireSuperAdmin, cancelSubscription);

//User...
router.get('/me', requireAuth, getMySubscriptions);

export default router;
