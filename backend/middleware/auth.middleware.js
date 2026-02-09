import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access Denied: Malformed token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        return res.status(500).json({ message: 'Failed to authenticate token.' });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: 'Access Denied: Requires Super Admin privileges' });
    }
    next();
};

export const isRestaurantOwner = (req, res, next) => {
    if (!req.user || req.user.role !== 'RESTAURANT_ADMIN') {
        return res.status(403).json({ message: 'Access Denied: Requires Restaurant Owner privileges' });
    }
    next();
};