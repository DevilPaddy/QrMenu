import models from '../models/index.js';
import {
    successResponse,
    errorResponse,
    notFoundResponse,
    forbiddenResponse
} from '../utils/response.js';

const {
    sequelize,
    Order,
    OrderItem,
    Cart,
    CartItem,
    MenuItem,
    Session
} = models;



export const createOrder = async (req, res) => {
    const session = req.session;

    const transaction = await sequelize.transaction();

    try {
        const cart = await Cart.findOne({
            where: { session_id: session.id },
            include: {
                model: CartItem,
                as: 'items',
                include: {
                    model: MenuItem,
                    as: 'menuItem'
                }
            },
            transaction
        });

        if (!cart || cart.items.length === 0) {
            await transaction.rollback();
            return forbiddenResponse(res, 'Cart is empty');
        }

        let totalAmount = 0;

        const order = await Order.create({
            session_id: session.id,
            status: 'PLACED',
            total_amount: 0
        }, { transaction });

        for (const item of cart.items) {
            const price = parseFloat(item.menuItem.price);
            const quantity = item.quantity;

            totalAmount += price * quantity;

            await OrderItem.create({
                order_id: order.id,
                menu_item_id: item.menu_item_id,
                quantity,
                price_snapshot: price
            }, { transaction });
        }

        order.total_amount = totalAmount;
        await order.save({ transaction });

        await CartItem.destroy({
            where: { cart_id: cart.id },
            transaction
        });

        await transaction.commit();

        return successResponse(
            res,
            'Order placed successfully',
            order,
            201
        );

    } catch (error) {
        await transaction.rollback();
        return errorResponse(
            res,
            'Failed to create order',
            'CREATE_ORDER_ERROR'
        );
    }
};



export const getSessionOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { session_id: req.session.id },
            include: {
                model: OrderItem,
                as: 'items'
            },
            order: [['created_at', 'DESC']]
        });

        return successResponse(
            res,
            'Orders retrieved successfully',
            orders
        );

    } catch (error) {
        return errorResponse(
            res,
            'Failed to retrieve orders',
            'GET_SESSION_ORDERS_ERROR'
        );
    }
};



export const getRestaurantOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: Session,
                    as: 'session',
                    where: { restaurant_id: req.restaurant.id },
                    attributes: []
                },
                {
                    model: OrderItem,
                    as: 'items'
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return successResponse(
            res,
            'Orders retrieved successfully',
            orders
        );

    } catch (error) {
        return errorResponse(
            res,
            'Failed to retrieve orders',
            'GET_RESTAURANT_ORDERS_ERROR'
        );
    }
};
