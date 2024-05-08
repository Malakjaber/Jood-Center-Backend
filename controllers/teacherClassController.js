const { sequelize } = require("../models");

const getClassesByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.id;

    // First, get all the class IDs taught by the teacher
    const teacherClasses = await sequelize.models.teacher_class.findAll({
      where: { teacher_id: teacherId },
      include: [
        {
          model: sequelize.models.class,
        },
      ],
    });

    const classes = teacherClasses.map((tc) => {
      return {
        class_id: tc.class.class_id,
        name: tc.class.name,
      };
    });
    res.json({
      message: "success",
      classes,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getTeacherByClassId = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = { getClassesByTeacherId, getTeacherByClassId };
