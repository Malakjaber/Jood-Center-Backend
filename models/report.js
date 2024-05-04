module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define(
    "report",
    {
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
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  report.associate = function (models) {
    report.belongsTo(models.class, { foreignKey: "class_id" });
    report.belongsTo(models.teacher, { foreignKey: "teacher_id" });
  };
  return report;
};
