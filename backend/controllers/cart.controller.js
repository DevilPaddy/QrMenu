import models from '../models/index.js';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse,
    conflictResponse,
    forbiddenResponse
} from '../utils/response.js';

const { Cart, CartItem, MenuItem } = models;


const getOrCreateCart = async (sessionId) => {
    let cart = await Cart.findOne({
        where: { session_id: sessionId }
    });

    if (!cart) {
        cart = await Cart.create({ session_id: sessionId });
    }

    return cart;
};


// POST /cart/items
export const addToCart = async (req, res) => {
    try {
        const { menu_item_id, quantity } = req.body;

        if (!menu_item_id || !quantity) {
            return validationErrorResponse(res, {
                fields: 'menu_item_id and quantity are required'
            });
        }

        if (Number(quantity) <= 0) {
            return validationErrorResponse(res, {
                quantity: 'Quantity must be greater than 0'
            });
        }

        const menuItem = await MenuItem.findByPk(menu_item_id, {
            include: { association: 'menu' }
        });

        if (!menuItem) {
            return notFoundResponse(res, 'Menu item');
        }

        if (!menuItem.is_available) {
            return conflictResponse(res, 'Menu item is not available for ordering');
        }

        const cart = await getOrCreateCart(req.session.id);

        const existingItem = await CartItem.findOne({
            where: {
                cart_id: cart.id,
                menu_item_id
            }
        });

        if (existingItem) {
            existingItem.quantity += Number(quantity);
            await existingItem.save();

            return successResponse(res, 'Cart item quantity updated', existingItem);
        }

        const cartItem = await CartItem.create({
            cart_id: cart.id,
            menu_item_id,
            quantity
        });

        return successResponse(res, 'Item added to cart', cartItem, 201);

    } catch (err) {
        console.error('Add To Cart Error:', err);
        return errorResponse(res, 'Failed to add item to cart', 'ADD_TO_CART_ERROR');
    }
};


// PATCH /cart/items/:id
export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || Number(quantity) <= 0) {
            return validationErrorResponse(res, {
                quantity: 'Quantity must be greater than 0'
            });
        }

        const cart = await getOrCreateCart(req.session.id);

        const item = await CartItem.findOne({
            where: {
                id,
                cart_id: cart.id
            }
        });

        if (!item) {
            return notFoundResponse(res, 'Cart item');
        }

        item.quantity = Number(quantity);
        await item.save();

        return successResponse(res, 'Cart item updated successfully', item);

    } catch (err) {
        console.error('Update Cart Item Error:', err);
        return errorResponse(res, 'Failed to update cart item', 'UPDATE_CART_ITEM_ERROR');
    }
};


// DELETE /cart/items/:id
export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const cart = await getOrCreateCart(req.session.id);

        const item = await CartItem.findOne({
            where: {
                id,
                cart_id: cart.id
            }
        });

        if (!item) {
            return notFoundResponse(res, 'Cart item');
        }

        await item.destroy();

        return successResponse(res, 'Cart item removed successfully');

    } catch (err) {
        console.error('Remove Cart Item Error:', err);
        return errorResponse(res, 'Failed to remove cart item', 'REMOVE_CART_ITEM_ERROR');
    }
};


// GET /cart
export const getCart = async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.session.id);

        const fullCart = await Cart.findByPk(cart.id, {
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: MenuItem,
                            as: 'menuItem'
                        }
                    ]
                }
            ]
        });

        return successResponse(res, 'Cart retrieved successfully', fullCart);

    } catch (err) {
        console.error('Get Cart Error:', err);
        return errorResponse(res, 'Failed to retrieve cart', 'GET_CART_ERROR');
    }
};
