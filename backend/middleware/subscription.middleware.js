import models from '../models/index.js';
const { Subscription } = models;

export const checkSubscription = async (req, res, next) => {
    try {
        if (req.user.role === 'SUPER_ADMIN') {
            return next();
        }

        const userId = req.user.id;

        const subscription = await Subscription.findOne({
            where: { user_id: userId },
            order: [['created_at', 'DESC']], // Get the most recent one
        });

        if (!subscription) {
            return res.status(403).json({ 
                message: 'Access Denied: No subscription plan found.' 
            });
        }

        if (subscription.status !== 'ACTIVE') {
            return res.status(403).json({ 
                message: `Access Denied: Your subscription is ${subscription.status}.` 
            });
        }

        const currentDate = new Date();
        const expiryDate = new Date(subscription.end_date);

        if (currentDate > expiryDate) {
            return res.status(403).json({ 
                message: 'Access Denied: Your subscription has expired.' 
            });
        }

        next();

    } catch (error) {
        console.error("Subscription Check Error:", error);
        return res.status(500).json({ message: 'Internal Server Error verifying subscription.' });
    }
};