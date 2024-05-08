const { report, classes, teacher } = require("../models"); // Adjust path as necessary

const getReports = async (req, res) => {
  try {
    const { id, st_id, teacher_id, grade_id, date } = req.body;

    if (!id && !st_id && !teacher_id && !grade_id && !date) {
      return res.status(400);
    }

    const conditions = {};

    if (id) {
      conditions.id = id;
    } else if (st_id) {
      conditions.st_id = st_id;
    } else if (teacher_id) {
      conditions.teacher_id = teacher_id;
    } else if (grade_id) {
      conditions.grade_id = grade_id;
    } else if (date) {
      conditions.date = date;
    }
    const data = await reports.findAll({ where: conditions });
    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

async function createReport(content, date, classId, teacherId) {
  try {
    // First, validate that the class and teacher exist
    const classExists = await classes.findByPk(classId);
    if (!classExists) {
      return { error: true, message: "Class not found" };
    }

    const teacherExists = await teacher.findByPk(teacherId);
    if (!teacherExists) {
      return { error: true, message: "Teacher not found" };
    }

    // Create the report
    const newReport = await report.create({
      content: content,
      date: date,
      class_id: classId,
      teacher_id: teacherId,
    });

    return {
      error: false,
      message: "Report created successfully",
      report: newReport,
    };
  } catch (error) {
    console.error("Error creating report", error);
    return { error: true, message: "Error creating report", details: error };
  }
}

module.exports = { getReports, createReport };
