const { sequelize } = require("../models");

const getTreatments = async (req, res) => {
  try {
    const { id, classId, teacher_id, date } = req.query;

    if (!id && !classId && !teacher_id && !date) {
      return res.sendStatus(400);
    }

    const conditions = {};

    if (id) {
      conditions.id = id;
    }
    if (classId) {
      conditions.class_id = classId;
    }
    if (teacher_id) {
      conditions.teacher_id = teacher_id;
    }
    if (date) {
      conditions.date = date;
    }

    const data = await sequelize.models.treatment_plan.findOne({
      where: conditions,
      include: [
        {
          model: sequelize.models.class, // Adjust the model name if necessary
          attributes: ["name"], // Only include the class name
        },
      ],
    });

    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

async function createTreatmentPlan(content, date, classId, teacherId) {
  try {
    // First, validate that the class and teacher exist
    const classExists = await sequelize.models.class.findByPk(classId);
    if (!classExists) {
      return { error: true, message: "Class Not Found" };
    }

    const teacherExists = await sequelize.models.teacher.findByPk(teacherId);
    if (!teacherExists) {
      return { error: true, message: "Teacher not found" };
    }

    // Create the report
    const newTreatmentPlan = await sequelize.models.treatment_plan.create({
      content: content,
      date: date,
      class_id: classId,
      teacher_id: teacherId,
    });

    return {
      message: "success",
      plan: newTreatmentPlan,
    };
  } catch (error) {
    console.error("Error creating treatment plan", error);
    return {
      error: true,
      message: "Error creating treatment plan",
      details: error,
    };
  }
}

const getStudentTreatmentPlans = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.sendStatus(400);
    }

    const student = await sequelize.models.student.findByPk(studentId, {
      include: {
        model: sequelize.models.class,
        include: {
          model: sequelize.models.treatment_plan,
          include: [
            {
              model: sequelize.models.teacher, // Include teacher details directly under treatment_plan
              attributes: ["username"], // Include only the teacher's username
            },
          ],
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Flatten the treatment plans and include the class name and teacher name
    const treatmentPlans = student.class.treatment_plans.map((plan) => ({
      ...plan.toJSON(),
      className: student.class.name,
      teacherName: plan.teacher ? plan.teacher.username : null,
    }));

    return res.status(200).json({ message: "success", data: treatmentPlans });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
module.exports = {
  getTreatments,
  createTreatmentPlan,
  getStudentTreatmentPlans,
};
