module.exports = (sequelize, DataTypes) => {
  const student = sequelize.define("student", {
    st_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    case: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    medicines: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  student.associate = function (models) {
    student.belongsTo(models.grade, { foreignKey: "grade_id" });
    student.belongsTo(models.parent, { foreignKey: "parent_id" });
    student.hasMany(models.treatment_plan, { foreignKey: "st_id" });
  };

  return student;
};
