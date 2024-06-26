const { sequelize } = require("../models");

const getReports = async (req, res) => {
  try {
    const { id, st_id, teacher_id, date, limit = 10, page = 1 } = req.query;

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

    const offset = (page - 1) * limit;

    const data = await sequelize.models.report.findAndCountAll({
      where: conditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Fetch all teacher information
    const teacherIds = data.rows.map((report) => report.teacher_id);
    const uniqueTeacherIds = [...new Set(teacherIds)];

    const teachers = await sequelize.models.teacher.findAll({
      where: { teacher_id: uniqueTeacherIds },
    });

    // Create a map of teacher IDs to their names
    const teacherMap = {};
    teachers.forEach((teacher) => {
      teacherMap[teacher.teacher_id] = teacher.username;
    });

    // Fetch all student information
    const studentIds = data.rows.map((report) => report.st_id);
    const uniqueStudentIds = [...new Set(studentIds)];

    const students = await sequelize.models.student.findAll({
      where: { st_id: uniqueStudentIds },
    });

    // Create a map of student IDs to their names
    const studentMap = {};
    students.forEach((student) => {
      studentMap[student.st_id] = student.name;
    });

    // Attach teacher's name and student's name to each report
    const reportsWithNames = data.rows.map((report) => ({
      ...report.toJSON(),
      teacherName: teacherMap[report.teacher_id] || null,
      studentName: studentMap[report.st_id] || null,
    }));

    return res.status(200).json({
      message: "success",
      data: reportsWithNames,
      total: data.count,
      pages: Math.ceil(data.count / limit),
      currentPage: parseInt(page),
    });
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
