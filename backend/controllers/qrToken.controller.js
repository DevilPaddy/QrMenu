import crypto from 'crypto';
import models from '../models/index.js';

const { QRToken, RestaurantTable, Restaurant } = models;

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

//POST /tables/:id/qr...
export const generateQRToken = async (req, res) => {
  try {
    const tableId = req.params.id;

    const restaurant = await Restaurant.findOne({
      where: { owner_id: req.user.id },
    });

    if (!restaurant) {
      return res.status(403).json({ message: 'Restaurant not found' });
    }

    const table = await RestaurantTable.findOne({
      where: {
        id: tableId,
        restaurant_id: restaurant.id,
      },
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const qrToken = await QRToken.create({
      table_id: table.id,
      token: generateToken(),
      is_active: true,
      regenerated_at: new Date(),
    });

    return res.status(201).json(qrToken);
  } catch (err) {
    console.error('Generate QR error:', err);
    return res.status(500).json({ message: 'Failed to generate QR token' });
  }
};

// PATCH /qr/:id/rotate...
export const rotateQRToken = async (req, res) => {
  try {
    const qrId = req.params.id;

    const oldToken = await QRToken.findByPk(qrId, {
      include: {
        model: RestaurantTable,
        include: Restaurant,
      },
    });

    if (!oldToken) {
      return res.status(404).json({ message: 'QR token not found' });
    }

    if (oldToken.RestaurantTable.Restaurant.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newToken = await QRToken.create({
      table_id: oldToken.table_id,
      token: generateToken(),
      is_active: true,
      regenerated_at: new Date(),
    });

    return res.status(201).json({
      message: 'QR token rotated successfully',
      newToken,
    });
  } catch (err) {
    console.error('Rotate QR error:', err);
    return res.status(500).json({ message: 'Failed to rotate QR token' });
  }
};

// GET /qr/:id...
export const getQRToken = async (req, res) => {
  try {
    const qrToken = await QRToken.findByPk(req.params.id, {
      include: {
        model: RestaurantTable,
      },
    });

    if (!qrToken) {
      return res.status(404).json({ message: 'QR token not found' });
    }

    return res.json(qrToken);
  } catch (err) {
    console.error('Get QR error:', err);
    return res.status(500).json({ message: 'Failed to fetch QR token' });
  }
};
