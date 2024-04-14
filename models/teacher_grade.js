module.exports = (sequelize, DataTypes) => {
  const teacher_grade = sequelize.define("teacher_grade", {
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    term: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  });

  teacher_grade.associate = function (models) {
    teacher_grade.belongsTo(models.teacher, { foreignKey: "teacher_id" });
    teacher_grade.belongsTo(models.grade, { foreignKey: "grade_id" });
  };

  return teacher_grade;
};
