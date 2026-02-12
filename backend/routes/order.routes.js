import express from 'express';
import {
    createOrder,
    getSessionOrders,
    getRestaurantOrders
} from '../controllers/order.controller.js';

import { verifyToken, isRestaurantOwner } from '../middleware/auth.middleware.js';
import { verifySession } from '../middleware/session.middleware.js';
import { checkSubscription } from '../middleware/subscription.middleware.js';
import { requireActiveSubscription } from '../middleware/subscription.enforce.middleware.js';

const router = express.Router();


router.post('/orders', verifySession, requireActiveSubscription, createOrder);
router.get('/orders/session', verifySession, getSessionOrders);


router.get(
    '/orders',
    verifyToken,
    isRestaurantOwner,
    checkSubscription,
    getRestaurantOrders
);

export default router;
