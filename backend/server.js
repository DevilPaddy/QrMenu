import express from 'express';
import cors from 'cors';
import models from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js'
import tablesRoutes from './routes/table.routes.js';
import qrTokenRoutes from './routes/qrToken.routes.js';
import sessionRoutes from './routes/session.route.js';
import menuRoutes from './routes/menu.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';

const { sequelize } = models;

const PORT = 8080;
const app = express();

// Middlewares 
app.use(express.json());
app.use(cors());

// Health check 
app.get('/', (req, res) => {
  res.send('hello from server!!!');
});

// Routes...

// auth routes...
app.use('/api/auth', authRoutes);
// Restaurant routes...
app.use('/api/restaurants', restaurantRoutes);
// Subscription routes...
app.use('/api/subscriptions', subscriptionRoutes);
// Table routes...
app.use('/api/tables', tablesRoutes);
// Qr code routes...
app.use('/api/qr', qrTokenRoutes);
// For user session routes...
app.use('/api/sessions', sessionRoutes);
// For the menu routes
app.use('/api/menus', menuRoutes);
// For cart routes
app.use('/api/cart', cartRoutes);
// For order routes
app.use('/api', orderRoutes);


// DB Sync...
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });

  } catch (err) {
    console.error('Server startup failed:', err);
  }
})();
