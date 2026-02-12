import express from 'express';
import {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart
} from '../controllers/cart.controller.js';

import { verifySession } from '../middleware/session.middleware.js';
import { requireActiveSubscription } from '../middleware/subscription.enforce.middleware.js';

const router = express.Router();

// Active session required
router.post('/cart/items', verifySession, requireActiveSubscription, addToCart);
router.patch('/cart/items/:id', verifySession, updateCartItem);
router.delete('/cart/items/:id', verifySession, removeCartItem);
router.get('/cart', verifySession, getCart);

export default router;
