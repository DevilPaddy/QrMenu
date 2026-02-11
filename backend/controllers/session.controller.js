import { Op } from 'sequelize';
import db from '../models/index.js';
import {
    successResponse,
    errorResponse,
    notFoundResponse,
    forbiddenResponse,
    conflictResponse
} from '../utils/response.js';

const { Session, QRToken, Restaurant } = db;

const SESSION_TTL_HOURS = 6;

// POST /sessions/start..
export const startSession = async (req, res) => {
    try {
        const { qr_token } = req.body;

        const qr = await QRToken.findOne({
            where: {
                token: qr_token,
                is_active: true,
                expires_at: { [Op.gt]: new Date() },
            },
            include: [{ model: Restaurant }],
        });

        if (!qr) {
            return notFoundResponse(res, 'QR token not found or expired');
        }

        if (qr.Restaurant.status !== 'ACTIVE') {
            return forbiddenResponse(res, 'Restaurant is not active');
        }

        const existingSession = await Session.findOne({
            where: {
                qr_token_id: qr.id,
                status: 'ACTIVE',
                expires_at: { [Op.gt]: new Date() },
            },
        });

        if (existingSession) {
            return conflictResponse(res, 'An active session already exists for this QR code', {
                existing_session_id: existingSession.id
            });
        }

        const now = new Date();
        const expiresAt = new Date(
            now.getTime() + SESSION_TTL_HOURS * 60 * 60 * 1000
        );

        const session = await Session.create({
            status: 'ACTIVE',
            last_activity_at: now,
            expires_at: expiresAt,
            qr_token_id: qr.id,
            restaurant_id: qr.Restaurant.id,
        });

        return successResponse(res, 'Session started successfully', session, 201);

    } catch (err) {
        console.error('Start Session Error:', err);
        return errorResponse(res, 'Failed to start session', 'START_SESSION_ERROR');
    }
};

// POST /sessions/cancel...
export const cancelSession = async (req, res) => {
    try {
        const { session_id } = req.body;

        const session = await Session.findOne({
            where: {
                id: session_id,
                status: 'ACTIVE',
            },
        });

        if (!session) {
            return notFoundResponse(res, 'Active session');
        }

        session.status = 'CLOSED';
        await session.save();

        return successResponse(res, 'Session cancelled successfully', session);

    } catch (err) {
        console.error('Cancel Session Error:', err);
        return errorResponse(res, 'Failed to cancel session', 'CANCEL_SESSION_ERROR');
    }
};
