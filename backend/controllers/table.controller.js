import models from '../models/index.js';
import { 
    successResponse, 
    errorResponse, 
    notFoundResponse,
    forbiddenResponse 
} from '../utils/response.js';

const { Restaurant, RestaurantTable } = models;

const getOwnedRestaurant = async (userId) => {
    return Restaurant.findOne({
        where: { owner_id: userId },
    });
};

//POST /tables...
export const createTable = async (req, res) => {
    try {
        const { table_number } = req.body;

        const restaurant = await getOwnedRestaurant(req.user.id);
        if (!restaurant) {
            return forbiddenResponse(res, 'No restaurant found for this user');
        }

        const table = await RestaurantTable.create({
            restaurant_id: restaurant.id,
            table_number: table_number.trim(),
        });

        return successResponse(res, 'Table created successfully', table, 201);
        
    } catch (err) {
        console.error('Create table error:', err);
        
        if (err.name === 'SequelizeUniqueConstraintError') {
            return errorResponse(res, 'Table number already exists for this restaurant', 'DUPLICATE_TABLE_NUMBER', null, 409);
        }
        
        return errorResponse(res, 'Failed to create table', 'CREATE_TABLE_ERROR');
    }
};

// GET /tables...
export const getTables = async (req, res) => {
    try {
        const restaurant = await getOwnedRestaurant(req.user.id);
        if (!restaurant) {
            return forbiddenResponse(res, 'No restaurant found for this user');
        }

        const tables = await RestaurantTable.findAll({
            where: { restaurant_id: restaurant.id },
            order: [['created_at', 'ASC']],
        });

        return successResponse(res, 'Tables retrieved successfully', tables);
        
    } catch (err) {
        console.error('Get tables error:', err);
        return errorResponse(res, 'Failed to retrieve tables', 'GET_TABLES_ERROR');
    }
};

// PATCH /tables/:id...
export const updateTable = async (req, res) => {
    try {
        const { table_number } = req.body;

        const restaurant = await getOwnedRestaurant(req.user.id);
        if (!restaurant) {
            return forbiddenResponse(res, 'No restaurant found for this user');
        }

        const table = await RestaurantTable.findOne({
            where: {
                id: req.params.id,
                restaurant_id: restaurant.id,
            },
        });

        if (!table) {
            return notFoundResponse(res, 'Table');
        }

        if (table_number && table_number.trim() !== table.table_number) {
            table.table_number = table_number.trim();
            await table.save();
        }

        return successResponse(res, 'Table updated successfully', table);
        
    } catch (err) {
        console.error('Update table error:', err);
        
        if (err.name === 'SequelizeUniqueConstraintError') {
            return errorResponse(res, 'Table number already exists for this restaurant', 'DUPLICATE_TABLE_NUMBER', null, 409);
        }
        
        return errorResponse(res, 'Failed to update table', 'UPDATE_TABLE_ERROR');
    }
};

// DELETE /tables/:id...
export const deleteTable = async (req, res) => {
    try {
        const restaurant = await getOwnedRestaurant(req.user.id);
        if (!restaurant) {
            return forbiddenResponse(res, 'No restaurant found for this user');
        }

        const table = await RestaurantTable.findOne({
            where: {
                id: req.params.id,
                restaurant_id: restaurant.id,
            },
        });

        if (!table) {
            return notFoundResponse(res, 'Table');
        }

        await table.destroy();

        return successResponse(res, 'Table deleted successfully', null, 204);
        
    } catch (err) {
        console.error('Delete table error:', err);
        return errorResponse(res, 'Failed to delete table', 'DELETE_TABLE_ERROR');
    }
};
