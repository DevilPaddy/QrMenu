import sequelize from '../config/database.js';
import '../models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Database synced');

    process.exit(0);
  } catch (err) {
    console.error('DB setup failed:', err);
    process.exit(1);
  }
})();
