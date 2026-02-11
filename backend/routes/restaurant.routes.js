import express from 'express';
import {
  createRestaurant,
  getRestaurants,
  enableRestaurants,
  disableRestaurants,
  getMyRestaurant,
  updateMyRestaurant
} from '../controllers/restaurant.controller.js';
import { checkSubscription } from '../middleware/subscription.middleware.js';
import { verifyToken, isAdmin, isRestaurantOwner } from '../middleware/auth.middleware.js';
import { 
  validateCreateRestaurant, 
  validateUpdateRestaurant, 
  validateIdParam,
  validatePagination 
} from '../middleware/validation.middleware.js';

const router = express.Router();

// RESTAURANT OWNER ROUTES...

// GET /me...
router.get('/me',
  verifyToken,
  isRestaurantOwner,
  getMyRestaurant
);

// PATCH /me
router.patch('/me',
  verifyToken,
  isRestaurantOwner,
  checkSubscription,
  validateUpdateRestaurant,
  updateMyRestaurant
);

// SUPER ADMIN ROUTES...

// GET / (List all)...
router.get('/',
  verifyToken,
  isAdmin,
  validatePagination,
  getRestaurants
);

// POST / (Create new)...
router.post('/',
  verifyToken,
  isAdmin,
  validateCreateRestaurant,
  createRestaurant
);

// PATCH /enable...
router.patch('/:id/enable',
  verifyToken,
  isAdmin,
  validateIdParam,
  enableRestaurants
);

// PATCH /disable...
router.patch('/:id/disable',
  verifyToken,
  isAdmin,
  validateIdParam,
  disableRestaurants
);

export default router;