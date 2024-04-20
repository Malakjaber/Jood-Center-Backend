module.exports = (sequelize, DataTypes) => {
  const teacher = sequelize.define("teacher", {
    teacher_id: {
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

  teacher.associate = function (models) {
    teacher.hasMany(models.teacher_grade, { foreignKey: "teacher_id" });
  };

  return teacher;
};
