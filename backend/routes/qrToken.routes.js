import { Router } from 'express';
import {
    generateQRToken,
    rotateQRToken,
    getQRToken,
} from '../controllers/qrToken.controller.js';

import {
    verifyToken,
    isRestaurantOwner,
} from '../middleware/auth.middleware.js';

import { validateIdParam } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/tables/:id/qr', verifyToken, isRestaurantOwner, validateIdParam, generateQRToken);
router.patch('/qr/:id/rotate', verifyToken, isRestaurantOwner, validateIdParam, rotateQRToken);
router.get('/qr/:id', verifyToken, isRestaurantOwner, validateIdParam, getQRToken);

export default router;
