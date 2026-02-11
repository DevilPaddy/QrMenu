export default (sequelize, DataTypes) => {
  return sequelize.define('Subscription', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'CANCELED'),
    starts_at: DataTypes.DATE,
    ends_at: DataTypes.DATE,
    plan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
