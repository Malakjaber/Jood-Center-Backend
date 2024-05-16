module.exports = (sequelize, DataTypes) => {
  const teacher_class = sequelize.define(
    "teacher_class",
    {
      teacher_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      timestamps: false,
    }
  );

  teacher_class.associate = function (models) {
    teacher_class.belongsTo(models.teacher, { foreignKey: "teacher_id" });
    teacher_class.belongsTo(models.class, { foreignKey: "class_id" });
  };

  return teacher_class;
};
