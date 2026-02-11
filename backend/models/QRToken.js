export default (sequelize, DataTypes) => {
  return sequelize.define('QRToken', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },

    regenerated_at: DataTypes.DATE,
  }, {
    tableName: 'qr_tokens',
    timestamps: false,
  });
};
