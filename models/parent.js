module.exports = (sequelize, DataTypes) => {
  const parent = sequelize.define("parent", {
    parent_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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

  parent.associate = function (models) {
    parent.hasMany(models.student, { foreignKey: "parent_id" });
  };

  return parent;
};
