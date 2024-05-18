module.exports = (sequelize, DataTypes) => {
  const co_manager = sequelize.define(
    "co_manager",
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: { type: DataTypes.TEXT, allowNull: true },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return co_manager;
};
