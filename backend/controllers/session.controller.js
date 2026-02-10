import { Op } from 'sequelize';
import db from '../models/index.js';

const { Session, QRToken, Restaurant } = db;

const SESSION_TTL_HOURS = 6;

// POST /sessions/start..
export const startSession = async (req, res) => {
    try {
        const { qr_token } = req.body;

        if (!qr_token) {
            return res.status(400).json({ message: 'QR token is required' });
        }

        const qr = await QRToken.findOne({
            where: {
                token: qr_token,
                expires_at: { [Op.gt]: new Date() },
            },
            include: [{ model: Restaurant }],
        });

        if (!qr) {
            return res.status(404).json({ message: 'Invalid or expired QR token' });
        }

        if (qr.Restaurant.status !== 'ACTIVE') {
            return res.status(403).json({ message: 'Restaurant is not active' });
        }

        const existingSession = await Session.findOne({
            where: {
                qr_token_id: qr.id,
                status: 'ACTIVE',
                expires_at: { [Op.gt]: new Date() },
            },
        });

        if (existingSession) {
            return res.status(409).json({
                message: 'An active session already exists for this QR',
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
            restaurant_id: qr.restaurant_id,
        });

        return res.status(201).json(session);
    } catch (err) {
        console.error('Start Session Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /sessions/cancel...
export const cancelSession = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const session = await Session.findOne({
            where: {
                id: session_id,
                status: 'ACTIVE',
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Active session not found' });
        }

        session.status = 'CLOSED';
        await session.save();

        return res.status(200).json(session);
    } catch (err) {
        console.error('Cancel Session Error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
