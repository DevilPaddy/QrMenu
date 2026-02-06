export default (sequelize, DataTypes) => {
  return sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: DataTypes.INTEGER,
  }, {
    tableName: 'cart_items',
    timestamps: false,
  });
};
