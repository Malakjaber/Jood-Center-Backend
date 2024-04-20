module.exports = (sequelize, DataTypes) => {
  const manager = sequelize.define("manager", {
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
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });
  return manager;
};
