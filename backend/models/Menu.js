export default  (sequelize, DataTypes) => {
  return sequelize.define('Menu', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'menus',
    timestamps: false,
  });
};
