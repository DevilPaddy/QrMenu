
export default  (sequelize, DataTypes) => {
  return sequelize.define('Restaurant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'restaurants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
