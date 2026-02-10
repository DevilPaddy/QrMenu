export default (sequelize, DataTypes) => {
  return sequelize.define('Session', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    qr_token_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: DataTypes.ENUM('ACTIVE', 'CLOSED', 'EXPIRED'),
    last_activity_at: DataTypes.DATE,
    expires_at: DataTypes.DATE,
  }, {
    tableName: 'sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
