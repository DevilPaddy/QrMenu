import models from '../models/index.js';
import { Op } from 'sequelize';

const { Subscription, Restaurant, sequelize } = models;

// POST sub (super-admin)
export const createSubscription = async (req, res) => {
    const { restaurant_id, plan, starts_at, ends_at } = req.body;

    if (!restaurant_id || !plan || !starts_at || !ends_at) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const startDate = new Date(starts_at);
    const endDate = new Date(ends_at);
    const now = new Date();

    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: 'Invalid date format' });
    }

    if (startDate >= endDate) {
        return res.status(400).json({ message: 'Invalid subscription period' });
    }

    if (endDate <= now) {
        return res.status(400).json({ message: 'Subscription already expired' });
    }

    const t = await sequelize.transaction();

    try {
        const restaurant = await Restaurant.findByPk(restaurant_id, { transaction: t });
        if (!restaurant) {
            await t.rollback();
            return res.status(404).json({ message: 'Restaurant not found' });
        }

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
        return res.status(201).json(subscription);
    } catch (err) {
        await t.rollback();
        console.error('Create subscription error:', err);
        return res.status(500).json({ message: 'Failed to create subscription' });
    }
};

// PATCH sub (super-admin)
export const cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        if (subscription.status !== 'ACTIVE') {
            return res.status(400).json({
                message: `Cannot cancel a ${subscription.status} subscription`,
            });
        }

        subscription.status = 'CANCELED';
        await subscription.save();

        return res.json({ message: 'Subscription canceled successfully' });
    } catch (err) {
        console.error('Cancel subscription error:', err);
        return res.status(500).json({ message: 'Failed to cancel subscription' });
    }
};

// GET sub...
export const getMySubscriptions = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const subscriptions = await Subscription.findAll({
            where: { restaurant_id: restaurant.id },
            order: [['createdAt', 'DESC']],
        });

        return res.json(subscriptions);
    } catch (err) {
        console.error('Get subscriptions error:', err);
        return res.status(500).json({ message: 'Failed to fetch subscriptions' });
    }
};
