import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

import User from './User.js';
import SuperAdmin from './SuperAdmin.js';
import Restaurant from './Restaurant.js';
import Subscription from './Subscription.js';
import RestaurantTable from './Table.js';
import QRToken from './QRToken.js';
import Session from './Session.js';
import Cart from './Cart.js';
import CartItem from './CartItems.js';
import Menu from './Menu.js';
import MenuItem from './MenuItems.js';
import Order from './Order.js';
import OrderItem from './OrderItems.js';

const models = {
  User: User(sequelize, DataTypes),
  SuperAdmin: SuperAdmin(sequelize, DataTypes),
  Restaurant: Restaurant(sequelize, DataTypes),
  Subscription: Subscription(sequelize, DataTypes),
  RestaurantTable: RestaurantTable(sequelize, DataTypes),
  QRToken: QRToken(sequelize, DataTypes),
  Session: Session(sequelize, DataTypes),
  Cart: Cart(sequelize, DataTypes),
  CartItem: CartItem(sequelize, DataTypes),
  Menu: Menu(sequelize, DataTypes),
  MenuItem: MenuItem(sequelize, DataTypes),
  Order: Order(sequelize, DataTypes),
  OrderItem: OrderItem(sequelize, DataTypes),
};

/* AUTH */
models.User.hasOne(models.Restaurant, { foreignKey: 'owner_id' });
models.Restaurant.belongsTo(models.User, { foreignKey: 'owner_id' });

models.User.hasOne(models.SuperAdmin, { foreignKey: 'user_id' });
models.SuperAdmin.belongsTo(models.User, { foreignKey: 'user_id' });

/* Restaurant domain */
models.Restaurant.hasMany(models.Subscription);
models.Restaurant.hasMany(models.RestaurantTable);
models.Restaurant.hasMany(models.Menu);

/* QR & Session */
models.RestaurantTable.hasMany(models.QRToken);
models.QRToken.hasMany(models.Session);

/* Cart */
models.Session.hasOne(models.Cart);
models.Cart.hasMany(models.CartItem);

/* Menu */
models.Menu.hasMany(models.MenuItem);

/* Orders */
models.Session.hasMany(models.Order);
models.Order.hasMany(models.OrderItem);

models.sequelize = sequelize;

export default models;
