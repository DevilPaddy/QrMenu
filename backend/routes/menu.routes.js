import express from 'express';
import {
    createMenu,
    getMenus,
    createMenuItem,
    updateMenuItem
} from '../controllers/menu.controller.js';

import { verifyToken, isRestaurantOwner } from '../middleware/auth.middleware.js';
import { checkSubscription } from '../middleware/subscription.middleware.js';

const router = express.Router();


router.post(
    '/menus',
    verifyToken,
    isRestaurantOwner,
    checkSubscription,
    createMenu
);

router.get(
    '/menus',
    verifyToken,
    isRestaurantOwner,
    checkSubscription,
    getMenus
);

router.post(
    '/menu-items',
    verifyToken,
    isRestaurantOwner,
    checkSubscription,
    createMenuItem
);

router.patch(
    '/menu-items/:id',
    verifyToken,
    isRestaurantOwner,
    checkSubscription,
    updateMenuItem
);

export default router;
