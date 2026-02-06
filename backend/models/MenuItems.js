export default  (sequelize, DataTypes) => {
  return sequelize.define('MenuItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10,2),
    is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'menu_items',
    timestamps: false,
  });
};
