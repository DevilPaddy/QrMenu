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

const router = Router();


router.post('/', verifyToken, isRestaurantOwner, createTable);
router.get('/', verifyToken, isRestaurantOwner, getTables);
router.patch('/:id', verifyToken, isRestaurantOwner, updateTable);
router.delete('/:id', verifyToken, isRestaurantOwner, deleteTable);

export default router;
