
export default  (sequelize, DataTypes) => {
  return sequelize.define('SuperAdmin', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password_hash: DataTypes.STRING,
  }, {
    tableName: 'super_admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
