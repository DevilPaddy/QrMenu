import { Op } from 'sequelize';
import models from '../models/index.js';
import {
    unauthorizedResponse,
    forbiddenResponse,
    errorResponse,
    notFoundResponse
} from '../utils/response.js';

const { Session } = models;

export const verifySession = async (req, res, next) => {
    try {
        const sessionId = req.headers['x-session-id'];

        if (!sessionId) {
            return unauthorizedResponse(res, 'Session ID is required');
        }

        const session = await Session.findOne({
            where: {
                id: sessionId,
                status: 'ACTIVE',
                expires_at: { [Op.gt]: new Date() },
            }
        });

        if (!session) {
            return forbiddenResponse(res, 'Session is invalid, inactive, or expired');
        }

        // Optional: update last activity...
        session.last_activity_at = new Date();
        await session.save();

        req.session = session;

        next();

    } catch (error) {
        console.error('Session Verification Error:', error);
        return errorResponse(
            res,
            'Failed to verify session',
            'SESSION_VERIFICATION_ERROR'
        );
    }
};
