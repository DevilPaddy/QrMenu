export default (sequelize, DataTypes) => {
  return sequelize.define(
    'RestaurantTable',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      table_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'restaurant_tables',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        {
          unique: true,
          fields: ['restaurant_id', 'table_number'],
        },
      ],
    }
  );
};
