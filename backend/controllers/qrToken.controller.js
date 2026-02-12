import crypto from 'crypto';
import models from '../models/index.js';
import { 
    successResponse, 
    errorResponse, 
    notFoundResponse,
    forbiddenResponse 
} from '../utils/response.js';

const { QRToken, RestaurantTable, Restaurant } = models;

const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

//POST /tables/:id/qr...
export const generateQRToken = async (req, res) => {
    try {
        const tableId = req.params.id;

        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return forbiddenResponse(res, 'No restaurant found for this user');
        }

        const table = await RestaurantTable.findOne({
            where: {
                id: tableId,
                restaurant_id: restaurant.id,
            },
        });

        if (!table) {
            return notFoundResponse(res, 'Table');
        }

        // Deactivate existing QR tokens for this table
        await QRToken.update(
            { is_active: false },
            { where: { table_id: table.id, is_active: true } }
        );

        const qrToken = await QRToken.create({
            table_id: table.id,
            token: generateToken(),
            is_active: true,
            regenerated_at: new Date(),
        });

        // Include table information in response
        const responseData = {
            ...qrToken.toJSON(),
            table_number: table.table_number
        };

        return successResponse(res, 'QR token generated successfully', responseData, 201);
        
    } catch (err) {
        console.error('Generate QR error:', err);
        return errorResponse(res, 'Failed to generate QR token', 'GENERATE_QR_ERROR');
    }
};

// PATCH /qr/:id/rotate...
export const rotateQRToken = async (req, res) => {
    try {
        const qrId = req.params.id;

        const oldToken = await QRToken.findByPk(qrId, {
            include: {
                model: RestaurantTable,
                include: Restaurant,
            },
        });

        if (!oldToken) {
            return notFoundResponse(res, 'QR token');
        }

        if (oldToken.RestaurantTable.Restaurant.owner_id !== req.user.id) {
            return forbiddenResponse(res, 'You do not have permission to rotate this QR token');
        }

        // Deactivate the old token
        oldToken.is_active = false;
        await oldToken.save();

        // Create new token
        const newToken = await QRToken.create({
            table_id: oldToken.table_id,
            token: generateToken(),
            is_active: true,
            regenerated_at: new Date(),
        });

        // Include table information in response
        const responseData = {
            ...newToken.toJSON(),
            table_number: oldToken.RestaurantTable.table_number
        };

        return successResponse(res, 'QR token rotated successfully', responseData, 201);
        
    } catch (err) {
        console.error('Rotate QR error:', err);
        return errorResponse(res, 'Failed to rotate QR token', 'ROTATE_QR_ERROR');
    }
};

// GET /qr/:id...
export const getQRToken = async (req, res) => {
    try {
        const qrToken = await QRToken.findByPk(req.params.id, {
            include: {
                model: RestaurantTable,
                include: Restaurant,
            },
        });

        if (!qrToken) {
            return notFoundResponse(res, 'QR token');
        }

        // Check ownership
        if (qrToken.RestaurantTable.Restaurant.owner_id !== req.user.id) {
            return forbiddenResponse(res, 'You do not have permission to view this QR token');
        }

        // Include table_number at top level for consistency
        const responseData = {
            ...qrToken.toJSON(),
            table_number: qrToken.RestaurantTable.table_number
        };

        return successResponse(res, 'QR token retrieved successfully', responseData);
        
    } catch (err) {
        console.error('Get QR error:', err);
        return errorResponse(res, 'Failed to retrieve QR token', 'GET_QR_ERROR');
    }
};
