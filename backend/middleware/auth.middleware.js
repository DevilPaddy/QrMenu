import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { unauthorizedResponse, forbiddenResponse, errorResponse } from '../utils/response.js';

dotenv.config();

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return unauthorizedResponse(res, 'Access token required');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return unauthorizedResponse(res, 'Malformed authorization header');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return unauthorizedResponse(res, 'Token has expired. Please log in again');
        }
        if (err.name === 'JsonWebTokenError') {
            return forbiddenResponse(res, 'Invalid token provided');
        }

        console.error('Token verification error:', err);
        return errorResponse(res, 'Token verification failed', 'TOKEN_VERIFICATION_ERROR');
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        return forbiddenResponse(res, 'Super Admin privileges required');
    }
    next();
};

export const isRestaurantOwner = (req, res, next) => {
    if (!req.user || req.user.role !== 'RESTAURANT_ADMIN') {
        return forbiddenResponse(res, 'Restaurant Owner privileges required');
    }
    next();
};