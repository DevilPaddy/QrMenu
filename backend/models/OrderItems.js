export default  (sequelize, DataTypes) => {
  return sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    item_name_snapshot: DataTypes.STRING,
    price_snapshot: DataTypes.DECIMAL(10,2),
    quantity: DataTypes.INTEGER,
  }, {
    tableName: 'order_items',
    timestamps: false,
  });
};
