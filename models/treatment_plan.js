module.exports = (sequelize, DataTypes) => {
  const treatment_plan = sequelize.define(
    "treatment_plan",
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
      st_id: {
        type: DataTypes.STRING(15),
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

  treatment_plan.associate = function (models) {
    treatment_plan.belongsTo(models.student, { foreignKey: "st_id" });
    treatment_plan.belongsTo(models.teacher, { foreignKey: "teacher_id" });
  };

  return treatment_plan;
};
