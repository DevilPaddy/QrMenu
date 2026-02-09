import models from '../models/index.js';
const { Restaurant } = models;

export const createRestaurant = async (req, res) => {
    try {
        let { name, owner_id } = req.body;

        if (!name || !owner_id) {
            return res.status(400).json({ message: 'Owner and Name are required' });
        }

        name = name.trim();

        const restaurant = await Restaurant.create({
            name,
            owner_id,
            status: 'ACTIVE',
        });

        return res.status(201).json(restaurant);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'A restaurant with this name already exists.' });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: 'Invalid owner_id provided.' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Restaurant.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            restaurants: rows,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving restaurant data' });
    }
};

export const enableRestaurants = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.status === 'ACTIVE') {
            return res.json({ message: 'Restaurant is already active', restaurant });
        }

        restaurant.status = 'ACTIVE';
        await restaurant.save();

        return res.status(200).json({ message: 'Restaurant enabled' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error enabling restaurant' });
    }
};

export const disableRestaurants = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.status === 'DISABLED') {
            return res.json({ message: 'Restaurant is already disabled', restaurant });
        }

        restaurant.status = 'DISABLED';
        await restaurant.save();

        return res.status(200).json({ message: 'Restaurant disabled' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error disabling restaurant' });
    }
};

export const getMyRestaurant = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized execution context' });
        }

        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'No restaurant found for this user' });
        }

        return res.json(restaurant);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching restaurant' });
    }
};

export const updateMyRestaurant = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized execution context' });
        }

        const restaurant = await Restaurant.findOne({
            where: { owner_id: req.user.id },
        });

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const { name } = req.body;
        let isUpdated = false;

        if (name && name.trim() !== '' && name !== restaurant.name) {
            restaurant.name = name.trim();
            isUpdated = true;
        }

        if (isUpdated) {
            await restaurant.save();
        }

        return res.json(restaurant);

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Restaurant name already taken' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Error updating restaurant' });
    }
};