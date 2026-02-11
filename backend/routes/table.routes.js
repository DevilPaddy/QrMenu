import { Router } from 'express';
import {
    createTable,
    getTables,
    updateTable,
    deleteTable,
} from '../controllers/table.controller.js';

import {
    verifyToken,
    isRestaurantOwner,
} from '../middleware/auth.middleware.js';

import {
    validateCreateTable,
    validateUpdateTable,
    validateIdParam
} from '../middleware/validation.middleware.js';

const router = Router();

router.post('/', verifyToken, isRestaurantOwner, validateCreateTable, createTable);
router.get('/', verifyToken, isRestaurantOwner, getTables);
router.patch('/:id', verifyToken, isRestaurantOwner, validateIdParam, validateUpdateTable, updateTable);
router.delete('/:id', verifyToken, isRestaurantOwner, validateIdParam, deleteTable);

export default router;
