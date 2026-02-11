import models from '../models/index.js';
import { forbiddenResponse, errorResponse } from '../utils/response.js';

const { Subscription, Restaurant } = models;

export const checkSubscription = async (req, res, next) => {
    try {
        if (req.user.role === 'SUPER_ADMIN') {
            return next();
        }

        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return forbiddenResponse(res, 'No restaurant found for this user');
        }

        const subscription = await Subscription.findOne({
            where: {
                restaurant_id: restaurant.id,
                status: 'ACTIVE',
            },
            order: [['created_at', 'DESC']],
        });

        if (!subscription) {
            return forbiddenResponse(res, 'Active subscription required to perform this action');
        }

        if (
            subscription.ends_at &&
            new Date() > new Date(subscription.ends_at)
        ) {
            return forbiddenResponse(res, 'Subscription has expired. Please renew to continue');
        }

        req.restaurant = restaurant;
        req.subscription = subscription;

        next();
    } catch (error) {
        console.error('Subscription Check Error:', error);
        return errorResponse(res, 'Failed to verify subscription status', 'SUBSCRIPTION_CHECK_ERROR');
    }
};
