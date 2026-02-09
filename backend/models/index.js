import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ensure this path is correct

// 1. Import Model Definitions
import UserDef from './User.js';
import RestaurantDef from './Restaurant.js';
import SubscriptionDef from './Subscription.js';
import RestaurantTableDef from './Table.js'; // Check filename: usually 'RestaurantTable.js' or 'Table.js'
import QRTokenDef from './QRToken.js';
import SessionDef from './Session.js';
import CartDef from './Cart.js';
import CartItemDef from './CartItems.js';
import MenuDef from './Menu.js';
import MenuItemDef from './MenuItems.js';
import OrderDef from './Order.js';
import OrderItemDef from './OrderItems.js';

// 2. Initialize Models
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

// 3. Define Associations
// (We do this AFTER all models are initialized to avoid circular dependency errors)

// --- Auth & Users ---
models.User.hasOne(models.Restaurant, { foreignKey: 'owner_id', as: 'restaurant' });
models.Restaurant.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });

// (Removed SuperAdmin relations because you commented out the model)

// --- Subscriptions ---
models.Restaurant.hasMany(models.Subscription, { foreignKey: 'restaurant_id' });
models.Subscription.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' });

// --- Tables ---
models.Restaurant.hasMany(models.RestaurantTable, { foreignKey: 'restaurant_id' });
models.RestaurantTable.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' });

// --- QR Tokens ---
models.RestaurantTable.hasMany(models.QRToken, { foreignKey: 'table_id' });
models.QRToken.belongsTo(models.RestaurantTable, { foreignKey: 'table_id' });

// --- Sessions ---
models.QRToken.hasMany(models.Session, { foreignKey: 'qr_token_id' });
models.Session.belongsTo(models.QRToken, { foreignKey: 'qr_token_id' });

// --- Menus ---
models.Restaurant.hasMany(models.Menu, { foreignKey: 'restaurant_id' });
models.Menu.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' });

models.Menu.hasMany(models.MenuItem, { foreignKey: 'menu_id' });
models.MenuItem.belongsTo(models.Menu, { foreignKey: 'menu_id' });

// --- Carts ---
models.Session.hasOne(models.Cart, { foreignKey: 'session_id' });
models.Cart.belongsTo(models.Session, { foreignKey: 'session_id' });

models.Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
models.CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id' });

// Link CartItems to MenuItems (so we know what food is in the cart)
models.MenuItem.hasMany(models.CartItem, { foreignKey: 'menu_item_id' });
models.CartItem.belongsTo(models.MenuItem, { foreignKey: 'menu_item_id' });

// --- Orders ---
models.Session.hasMany(models.Order, { foreignKey: 'session_id' });
models.Order.belongsTo(models.Session, { foreignKey: 'session_id' });

models.Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
models.OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });

// Link OrderItems to MenuItems (so we know what food was ordered)
models.MenuItem.hasMany(models.OrderItem, { foreignKey: 'menu_item_id' });
models.OrderItem.belongsTo(models.MenuItem, { foreignKey: 'menu_item_id' });


// 4. Attach Sequelize Instance
models.sequelize = sequelize;
models.Sequelize = sequelize.Sequelize;

export default models;