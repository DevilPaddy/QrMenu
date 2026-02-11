import models from '../models/index.js';
import { 
    successResponse, 
    errorResponse, 
    conflictResponse, 
    notFoundResponse,
    forbiddenResponse 
} from '../utils/response.js';

const { Restaurant } = models;

export const createRestaurant = async (req, res) => {
    try {
        let { name, owner_id, address } = req.body;

        name = name.trim();

        const restaurant = await Restaurant.create({
            name,
            owner_id,
            address: address?.trim() || null,
            status: 'ACTIVE',
        });

        return successResponse(res, 'Restaurant created successfully', restaurant, 201);

    } catch (error) {
        console.error('Create restaurant error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return conflictResponse(res, 'A restaurant with this name already exists', { name });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return errorResponse(res, 'Invalid owner_id provided', 'INVALID_OWNER', null, 400);
        }
        
        return errorResponse(res, 'Failed to create restaurant', 'CREATE_RESTAURANT_ERROR');
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Restaurant.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
            attributes: { exclude: [] } // Include all fields for admin
        });

        const paginationData = {
            restaurants: rows,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit
            }
        };

        return successResponse(res, 'Restaurants retrieved successfully', paginationData);
        
    } catch (err) {
        console.error('Get restaurants error:', err);
        return errorResponse(res, 'Failed to retrieve restaurants', 'GET_RESTAURANTS_ERROR');
    }
};

export const enableRestaurants = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return notFoundResponse(res, 'Restaurant');
        }

        if (restaurant.status === 'ACTIVE') {
            return successResponse(res, 'Restaurant is already active', restaurant);
        }

        restaurant.status = 'ACTIVE';
        await restaurant.save();

        return successResponse(res, 'Restaurant enabled successfully', restaurant);
        
    } catch (err) {
        console.error('Enable restaurant error:', err);
        return errorResponse(res, 'Failed to enable restaurant', 'ENABLE_RESTAURANT_ERROR');
    }
};

export const disableRestaurants = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return notFoundResponse(res, 'Restaurant');
        }

        if (restaurant.status === 'DISABLED') {
            return successResponse(res, 'Restaurant is already disabled', restaurant);
        }

        restaurant.status = 'DISABLED';
        await restaurant.save();

        return successResponse(res, 'Restaurant disabled successfully', restaurant);

    } catch (err) {
        console.error('Disable restaurant error:', err);
        return errorResponse(res, 'Failed to disable restaurant', 'DISABLE_RESTAURANT_ERROR');
    }
};

export const getMyRestaurant = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return forbiddenResponse(res, 'Invalid authentication context');
        }

        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return notFoundResponse(res, 'Restaurant');
        }

        return successResponse(res, 'Restaurant retrieved successfully', restaurant);

    } catch (err) {
        console.error('Get my restaurant error:', err);
        return errorResponse(res, 'Failed to retrieve restaurant', 'GET_MY_RESTAURANT_ERROR');
    }
};

export const updateMyRestaurant = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return forbiddenResponse(res, 'Invalid authentication context');
        }

        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return notFoundResponse(res, 'Restaurant');
        }

        const { name, address } = req.body;
        let isUpdated = false;

        if (name && name.trim() !== '' && name.trim() !== restaurant.name) {
            restaurant.name = name.trim();
            isUpdated = true;
        }

        if (address !== undefined && address?.trim() !== restaurant.address) {
            restaurant.address = address?.trim() || null;
            isUpdated = true;
        }

        if (isUpdated) {
            await restaurant.save();
        }

        return successResponse(res, 'Restaurant updated successfully', restaurant);

    } catch (err) {
        console.error('Update restaurant error:', err);
        
        if (err.name === 'SequelizeUniqueConstraintError') {
            return conflictResponse(res, 'Restaurant name already taken', { name: req.body.name });
        }
        
        return errorResponse(res, 'Failed to update restaurant', 'UPDATE_RESTAURANT_ERROR');
    }
};