export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true, // null for Google users
    },

    role: {
      type: DataTypes.ENUM('SUPER_ADMIN', 'RESTAURANT_ADMIN'),
      allowNull: false,
    },

    provider: {
      type: DataTypes.ENUM('LOCAL', 'GOOGLE'),
      defaultValue: 'LOCAL',
    },

    provider_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return User;
};
