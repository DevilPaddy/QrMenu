export default  (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    total_amount: DataTypes.DECIMAL(10,2),
    status: DataTypes.ENUM('PLACED', 'PREPARING', 'SERVED'),
  }, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
