module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define("report", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  report.associate = function (models) {
    report.belongsTo(models.grade, { foreignKey: "grade_id" });
  };
  return report;
};
