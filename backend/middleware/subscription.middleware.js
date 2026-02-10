import models from '../models/index.js';

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
            return res.status(403).json({
                message: 'Access Denied: No restaurant found for this user.',
            });
        }

        const subscription = await Subscription.findOne({
            where: {
                restaurant_id: restaurant.id,
                status: 'ACTIVE',
            },
            order: [['created_at', 'DESC']],
        });

        if (!subscription) {
            return res.status(403).json({
                message: 'Access Denied: No active subscription found.',
            });
        }

        if (
            subscription.end_date &&
            new Date() > new Date(subscription.end_date)
        ) {
            return res.status(403).json({
                message: 'Access Denied: Subscription has expired.',
            });
        }

        req.restaurant = restaurant;
        req.subscription = subscription;

        next();
    } catch (error) {
        console.error('Subscription Check Error:', error);
        return res
            .status(500)
            .json({ message: 'Internal Server Error verifying subscription.' });
    }
};
