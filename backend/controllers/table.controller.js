import models from '../models/index.js';

const { Restaurant, RestaurantTable } = models;

const getOwnedRestaurant = async (userId) => {
  return Restaurant.findOne({
    where: { owner_id: userId },
  });
};

//POST /tables...
export const createTable = async (req, res) => {
  const { table_number } = req.body;

  if (!table_number) {
    return res.status(400).json({ message: 'table_number is required' });
  }

  try {
    const restaurant = await getOwnedRestaurant(req.user.id);
    if (!restaurant) {
      return res.status(403).json({ message: 'Restaurant not found' });
    }

    const table = await RestaurantTable.create({
      restaurant_id: restaurant.id,
      table_number,
    });

    return res.status(201).json(table);
  } catch (err) {
    console.error('Create table error:', err);
    return res.status(500).json({ message: 'Failed to create table' });
  }
};


// GET /tables...

export const getTables = async (req, res) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user.id);
    if (!restaurant) {
      return res.status(403).json({ message: 'Restaurant not found' });
    }

    const tables = await RestaurantTable.findAll({
      where: { restaurant_id: restaurant.id },
      order: [['created_at', 'ASC']],
    });

    return res.json(tables);
  } catch (err) {
    console.error('Get tables error:', err);
    return res.status(500).json({ message: 'Failed to fetch tables' });
  }
};


// PATCH /tables/:id...

export const updateTable = async (req, res) => {
  const { table_number } = req.body;

  try {
    const restaurant = await getOwnedRestaurant(req.user.id);
    if (!restaurant) {
      return res.status(403).json({ message: 'Restaurant not found' });
    }

    const table = await RestaurantTable.findOne({
      where: {
        id: req.params.id,
        restaurant_id: restaurant.id,
      },
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (table_number) table.table_number = table_number;
    await table.save();

    return res.json(table);
  } catch (err) {
    console.error('Update table error:', err);
    return res.status(500).json({ message: 'Failed to update table' });
  }
};


// DELETE /tables/:id...
export const deleteTable = async (req, res) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user.id);
    if (!restaurant) {
      return res.status(403).json({ message: 'Restaurant not found' });
    }

    const table = await RestaurantTable.findOne({
      where: {
        id: req.params.id,
        restaurant_id: restaurant.id,
      },
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    await table.destroy();

    return res.json({ message: 'Table deleted successfully' });
  } catch (err) {
    console.error('Delete table error:', err);
    return res.status(500).json({ message: 'Failed to delete table' });
  }
};
