
export default  (sequelize, DataTypes) => {
  return sequelize.define('Session', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: DataTypes.ENUM('ACTIVE', 'CLOSED', 'EXPIRED'),
    last_activity_at: DataTypes.DATE,
    expires_at: DataTypes.DATE,
  }, {
    tableName: 'sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });
};
