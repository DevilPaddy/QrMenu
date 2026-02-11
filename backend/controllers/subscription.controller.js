import models from '../models/index.js';
import { Op } from 'sequelize';
import { 
    successResponse, 
    errorResponse, 
    notFoundResponse,
    forbiddenResponse 
} from '../utils/response.js';

const { Subscription, Restaurant, sequelize } = models;

// POST sub (super-admin)
export const createSubscription = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { restaurant_id, plan, starts_at, ends_at } = req.body;

        const startDate = new Date(starts_at);
        const endDate = new Date(ends_at);
        const now = new Date();

        const restaurant = await Restaurant.findByPk(restaurant_id, { transaction: t });
        if (!restaurant) {
            await t.rollback();
            return notFoundResponse(res, 'Restaurant');
        }

        // Expire existing active subscriptions
        await Subscription.update(
            { status: 'EXPIRED' },
            {
                where: {
                    restaurant_id,
                    status: 'ACTIVE',
                },
                transaction: t,
            }
        );

        const subscription = await Subscription.create(
            {
                restaurant_id,
                plan,
                starts_at: startDate,
                ends_at: endDate,
                status: startDate <= now ? 'ACTIVE' : 'EXPIRED',
            },
            { transaction: t }
        );

        await t.commit();
        return successResponse(res, 'Subscription created successfully', subscription, 201);
        
    } catch (err) {
        await t.rollback();
        console.error('Create subscription error:', err);
        return errorResponse(res, 'Failed to create subscription', 'CREATE_SUBSCRIPTION_ERROR');
    }
};

// PATCH sub (super-admin)
export const cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);

        if (!subscription) {
            return notFoundResponse(res, 'Subscription');
        }

        if (subscription.status !== 'ACTIVE') {
            return errorResponse(res, `Cannot cancel a ${subscription.status} subscription`, 'INVALID_STATUS', null, 400);
        }

        subscription.status = 'CANCELED';
        await subscription.save();

        return successResponse(res, 'Subscription cancelled successfully', subscription);
        
    } catch (err) {
        console.error('Cancel subscription error:', err);
        return errorResponse(res, 'Failed to cancel subscription', 'CANCEL_SUBSCRIPTION_ERROR');
    }
};

// GET sub...
export const getMySubscriptions = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return forbiddenResponse(res, 'No restaurant found for this user');
        }

        const subscriptions = await Subscription.findAll({
            where: {
                restaurant_id: restaurant.id,
            },
            order: [['created_at', 'DESC']],
        });

        return successResponse(res, 'Subscriptions retrieved successfully', subscriptions);
        
    } catch (err) {
        console.error('Get subscriptions error:', err);
        return errorResponse(res, 'Failed to retrieve subscriptions', 'GET_SUBSCRIPTIONS_ERROR');
    }
};
