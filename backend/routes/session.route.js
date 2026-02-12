import { Router } from 'express';
import {
  startSession,
  cancelSession,
} from '../controllers/session.controller.js';

import {
  validateStartSession,
  validateCancelSession
} from '../middleware/validation.middleware.js';

import {
  requireActiveSubscription
} from '../middleware/subscription.enforce.middleware.js'
const router = Router();

router.post('/sessions/start', validateStartSession, requireActiveSubscription, startSession);
router.post('/sessions/cancel', validateCancelSession, cancelSession);

export default router;
