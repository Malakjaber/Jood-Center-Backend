module.exports = (sequelize, DataTypes) => {
  const treatment_plan = sequelize.define("treatment_plan", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    st_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  treatment_plan.associate = function (models) {
    treatment_plan.belongsTo(models.student, { foreignKey: "st_id" });
  };

  return treatment_plan;
};
