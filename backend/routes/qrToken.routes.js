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

const router = Router();

router.post('/tables/:id/qr', verifyToken, isRestaurantOwner, generateQRToken);
router.patch('/qr/:id/rotate', verifyToken, isRestaurantOwner, rotateQRToken);
router.get('/qr/:id', verifyToken, isRestaurantOwner, getQRToken);

export default router;
