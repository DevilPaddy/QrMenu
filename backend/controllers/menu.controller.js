import models from '../models/index.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

const { Menu, MenuItem } = models;


// POST /menus
export const createMenu = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length < 2) {
            return validationErrorResponse(res, {
                name: 'Menu name must be at least 2 characters'
            });
        }

        const menu = await Menu.create({
            name: name.trim(),
            restaurant_id: req.restaurant.id
        });

        return successResponse(res, 'Menu created successfully', menu, 201);

    } catch (err) {
        console.error('Create Menu Error:', err);
        return errorResponse(res, 'Failed to create menu', 'CREATE_MENU_ERROR');
    }
};


// GET /menus
export const getMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll({
            where: { restaurant_id: req.restaurant.id },
            include: [
                {
                    model: MenuItem,
                    as: 'items'
                }
            ],
            order: [['id', 'DESC']]
        });

        return successResponse(res, 'Menus retrieved successfully', menus);

    } catch (err) {
        console.error('Get Menus Error:', err);
        return errorResponse(res, 'Failed to retrieve menus', 'GET_MENUS_ERROR');
    }
};


// POST /menu-items
export const createMenuItem = async (req, res) => {
    try {
        const { name, price, menu_id } = req.body;

        if (!name || !price || !menu_id) {
            return validationErrorResponse(res, {
                fields: 'name, price and menu_id are required'
            });
        }

        if (Number(price) <= 0) {
            return validationErrorResponse(res, {
                price: 'Price must be greater than 0'
            });
        }

        const menu = await Menu.findOne({
            where: {
                id: menu_id,
                restaurant_id: req.restaurant.id
            }
        });

        if (!menu) {
            return notFoundResponse(res, 'Menu');
        }

        const item = await MenuItem.create({
            name: name.trim(),
            price,
            menu_id,
            is_available: true
        });

        return successResponse(res, 'Menu item created successfully', item, 201);

    } catch (err) {
        console.error('Create Menu Item Error:', err);
        return errorResponse(res, 'Failed to create menu item', 'CREATE_MENU_ITEM_ERROR');
    }
};


// PATCH /menu-items/:id
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, is_available } = req.body;

        const item = await MenuItem.findByPk(id, {
            include: {
                model: Menu,
                as: 'menu'
            }
        });

        if (!item) {
            return notFoundResponse(res, 'Menu item');
        }

        if (item.menu.restaurant_id !== req.restaurant.id) {
            return forbiddenResponse(res, 'Unauthorized access to this menu item');
        }

        if (price !== undefined && Number(price) <= 0) {
            return validationErrorResponse(res, {
                price: 'Price must be greater than 0'
            });
        }

        await item.update({
            name: name ?? item.name,
            price: price ?? item.price,
            is_available: is_available ?? item.is_available
        });

        return successResponse(res, 'Menu item updated successfully', item);

    } catch (err) {
        console.error('Update Menu Item Error:', err);
        return errorResponse(res, 'Failed to update menu item', 'UPDATE_MENU_ITEM_ERROR');
    }
};
