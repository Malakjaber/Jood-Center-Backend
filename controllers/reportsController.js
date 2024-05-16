const { sequelize } = require("../models");

const getReports = async (req, res) => {
  try {
    const { id, st_id, teacher_id, date } = req.query;

    if (!id && !st_id && !teacher_id && !date) {
      return res.sendStatus(400);
    }

    const conditions = {};

    if (id) {
      conditions.id = id;
    }
    if (st_id) {
      conditions.st_id = st_id;
    }
    if (teacher_id) {
      conditions.teacher_id = teacher_id;
    }
    if (date) {
      conditions.date = date;
    }

    console.log("Conditions", conditions);

    const data = await sequelize.models.report.findAll({ where: conditions });
    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

async function createReport(content, date, st_id, teacherId) {
  try {
    // First, validate that the student and teacher exist
    const studentExists = await sequelize.models.student.findByPk(st_id);
    if (!studentExists) {
      return { error: true, message: "Student not found" };
    }

    const teacherExists = await sequelize.models.teacher.findByPk(teacherId);
    if (!teacherExists) {
      return { error: true, message: "Teacher not found" };
    }

    // Create the report
    const newReport = await sequelize.models.report.create({
      content: content,
      date: date,
      st_id: st_id,
      teacher_id: teacherId,
    });

    return {
      message: "success",
      report: newReport,
    };
  } catch (error) {
    console.error("Error creating report", error);
    return { error: true, message: "Error creating report", details: error };
  }
}

module.exports = { getReports, createReport };
