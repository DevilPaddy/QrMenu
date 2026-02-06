
export default (sequelize, DataTypes) => {
  return sequelize.define('RestaurantTable', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    table_number: DataTypes.STRING,
  }, {
    tableName: 'restaurant_tables',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
