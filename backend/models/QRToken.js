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

    regenerated_at: DataTypes.DATE,
  }, {
    tableName: 'qr_tokens',
    timestamps: false,
  });
};
