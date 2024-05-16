module.exports = (sequelize, DataTypes) => {
  const teacher = sequelize.define(
    "teacher",
    {
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
      // address: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  teacher.associate = function (models) {
    teacher.hasMany(models.teacher_class, { foreignKey: "teacher_id" });
    teacher.hasMany(models.report, { foreignKey: "teacher_id" });
    teacher.hasMany(models.treatment_plan, { foreignKey: "teacher_id" });
  };

  return teacher;
};
