import { Router } from 'express';
import {
  startSession,
  cancelSession,
} from '../controllers/session.controller.js';

const router = Router();


router.post('/sessions/start', startSession);
router.post('/sessions/cancel', cancelSession);

export default router;
