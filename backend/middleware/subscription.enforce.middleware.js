import models from '../models/index.js';
import {
    forbiddenResponse,
    errorResponse
} from '../utils/response.js';

const { Subscription } = models;

export const requireActiveSubscription = async (req, res, next) => {
    try {
        const session = req.session;

        if (!session) {
            return forbiddenResponse(res, 'Session required');
        }

        const subscription = await Subscription.findOne({
            where: {
                restaurant_id: session.restaurant_id,
                status: 'ACTIVE',
            },
            order: [['created_at', 'DESC']],
        });

        if (!subscription) {
            return forbiddenResponse(
                res,
                'Active subscription required to place orders'
            );
        }

        if (
            subscription.ends_at &&
            new Date() > new Date(subscription.ends_at)
        ) {
            return forbiddenResponse(
                res,
                'Subscription has expired. Ordering is disabled'
            );
        }

        next();

    } catch (error) {
        console.error('Subscription Enforcement Error:', error);
        return errorResponse(
            res,
            'Failed to verify subscription',
            'SUBSCRIPTION_ENFORCEMENT_ERROR'
        );
    }
};
