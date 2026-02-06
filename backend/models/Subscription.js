
export default  (sequelize, DataTypes) => {
  return sequelize.define('Subscription', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'SUSPENDED'),
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
