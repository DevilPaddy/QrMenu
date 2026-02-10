import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// =======================
// 1. Import Model Definitions
// =======================
import UserDef from './User.js';
import RestaurantDef from './Restaurant.js';
import SubscriptionDef from './Subscription.js';
import RestaurantTableDef from './Table.js';
import QRTokenDef from './QRToken.js';
import SessionDef from './Session.js';
import CartDef from './Cart.js';
import CartItemDef from './CartItems.js';
import MenuDef from './Menu.js';
import MenuItemDef from './MenuItems.js';
import OrderDef from './Order.js';
import OrderItemDef from './OrderItems.js';

// =======================
// 2. Initialize Models
// =======================
const models = {
  User: UserDef(sequelize, DataTypes),
  Restaurant: RestaurantDef(sequelize, DataTypes),
  Subscription: SubscriptionDef(sequelize, DataTypes),
  RestaurantTable: RestaurantTableDef(sequelize, DataTypes),
  QRToken: QRTokenDef(sequelize, DataTypes),
  Session: SessionDef(sequelize, DataTypes),
  Cart: CartDef(sequelize, DataTypes),
  CartItem: CartItemDef(sequelize, DataTypes),
  Menu: MenuDef(sequelize, DataTypes),
  MenuItem: MenuItemDef(sequelize, DataTypes),
  Order: OrderDef(sequelize, DataTypes),
  OrderItem: OrderItemDef(sequelize, DataTypes),
};

// =======================
// 3. Define Associations
// =======================

// --- Users & Restaurants (Owner) ---
models.User.hasOne(models.Restaurant, {
  foreignKey: 'owner_id',
  as: 'restaurant',
});

models.Restaurant.belongsTo(models.User, {
  foreignKey: 'owner_id',
  as: 'owner',
});

// --- Subscriptions (Restaurant-based SaaS model) ---
models.Restaurant.hasMany(models.Subscription, {
  foreignKey: 'restaurant_id',
  as: 'subscriptions',
});

models.Subscription.belongsTo(models.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant',
});

// --- Restaurant Tables ---
models.Restaurant.hasMany(models.RestaurantTable, {
  foreignKey: 'restaurant_id',
  as: 'tables',
});

models.RestaurantTable.belongsTo(models.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant',
});

// --- QR Tokens ---
models.RestaurantTable.hasMany(models.QRToken, {
  foreignKey: 'table_id',
  as: 'qrTokens',
});

models.QRToken.belongsTo(models.RestaurantTable, {
  foreignKey: 'table_id',
  as: 'table',
});

// --- Sessions (IMPORTANT: direct link to Restaurant) ---
models.Restaurant.hasMany(models.Session, {
  foreignKey: 'restaurant_id',
  as: 'sessions',
});

models.Session.belongsTo(models.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant',
});

models.QRToken.hasMany(models.Session, {
  foreignKey: 'qr_token_id',
  as: 'sessions',
});

models.Session.belongsTo(models.QRToken, {
  foreignKey: 'qr_token_id',
  as: 'qrToken',
});

// --- Menus ---
models.Restaurant.hasMany(models.Menu, {
  foreignKey: 'restaurant_id',
  as: 'menus',
});

models.Menu.belongsTo(models.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant',
});

models.Menu.hasMany(models.MenuItem, {
  foreignKey: 'menu_id',
  as: 'items',
});

models.MenuItem.belongsTo(models.Menu, {
  foreignKey: 'menu_id',
  as: 'menu',
});

// --- Carts ---
models.Session.hasOne(models.Cart, {
  foreignKey: 'session_id',
  as: 'cart',
});

models.Cart.belongsTo(models.Session, {
  foreignKey: 'session_id',
  as: 'session',
});

models.Cart.hasMany(models.CartItem, {
  foreignKey: 'cart_id',
  as: 'items',
});

models.CartItem.belongsTo(models.Cart, {
  foreignKey: 'cart_id',
  as: 'cart',
});

// --- Cart Items → Menu Items ---
models.MenuItem.hasMany(models.CartItem, {
  foreignKey: 'menu_item_id',
  as: 'cartItems',
});

models.CartItem.belongsTo(models.MenuItem, {
  foreignKey: 'menu_item_id',
  as: 'menuItem',
});

// --- Orders ---
models.Session.hasMany(models.Order, {
  foreignKey: 'session_id',
  as: 'orders',
});

models.Order.belongsTo(models.Session, {
  foreignKey: 'session_id',
  as: 'session',
});

models.Order.hasMany(models.OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
});

models.OrderItem.belongsTo(models.Order, {
  foreignKey: 'order_id',
  as: 'order',
});

// --- Order Items → Menu Items ---
models.MenuItem.hasMany(models.OrderItem, {
  foreignKey: 'menu_item_id',
  as: 'orderItems',
});

models.OrderItem.belongsTo(models.MenuItem, {
  foreignKey: 'menu_item_id',
  as: 'menuItem',
});

// =======================
// 4. Attach Sequelize Instance
// =======================
models.sequelize = sequelize;
models.Sequelize = sequelize.Sequelize;

export default models;
