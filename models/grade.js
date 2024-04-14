module.exports = (sequelize, DataTypes) => {
  const grade = sequelize.define("grade", {
    grade_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  });

  grade.associate = function (models) {
    grade.hasMany(models.report, { foreignKey: "grade_id" });
    grade.hasMany(models.student, { foreignKey: "grade_id" });
  };

  return grade;
};
