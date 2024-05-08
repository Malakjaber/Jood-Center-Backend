const { Op, where } = require("sequelize");
const { student } = require("../models");
const { sequelize } = require("../models");

const getAllStudents = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    if (page < 0) {
      page = 1;
    }
    if (limit > 160 || limit < 0) {
      limit = 12;
    }

    let search = req.query.search;
    let conditions = {};

    if (search) {
      search = search.toString();
      conditions.name = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const students = await student.findAll({
      where: conditions,
      order: [["parent_id", "ASC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    const count = await student.count({
      where: conditions,
    });

    return res.status(200).json({ message: "success", count, students });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number.isNaN(id)) {
      return res.status(400);
    }

    let studentProfile = await student.findByPk(id);

    if (!studentProfile) {
      return res.status(400).json({ error: "Student not found" });
    }

    return res
      .status(200)
      .json({ message: "success", student: studentProfile });
  } catch (error) {
    return res.status(500);
  }
};
const addNewStudent = async (req, res) => {
  try {
    const {
      st_id,
      name,
      birth_date,
      pathological_case,
      phone,
      address,
      medicines,
      parent_id,
      class_id,
    } = req.body;

    if (!st_id) {
      return res.status(400).json({ error: "Student Id not provided" });
    }

    if (await student.findByPk(st_id)) {
      return res.status(400).json({ error: "Student Added Before" });
    }

    const newStudent = await student.create({
      st_id,
      name,
      birth_date,
      pathological_case,
      phone,
      address,
      medicines,
      class_id,
      parent_id,
    });

    res.json({
      message: "success",
      newStudent,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
const removeStudent = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedStudent = await student.destroy({
      where: { st_id: id },
    });
    if (deletedStudent === 0) {
      return res.status(404).json({ error: "Student ID not found" });
    }
    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStudentsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    let classId = Number(req.query.classId);
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 12;
    let search = req.query.search;

    // First, get all the class IDs taught by the teacher
    const teacherClasses = await sequelize.models.teacher_class.findAll({
      where: { teacher_id: teacherId },
      include: [
        {
          model: sequelize.models.class,
          where: classId ? { class_id: classId } : {},
        },
      ],
    });

    const classIds = teacherClasses.map((tc) => tc.class.class_id);

    // Query students directly related to the classes taught by the teacher
    const { count, rows: students } =
      await sequelize.models.student.findAndCountAll({
        where: {
          class_id: { [Op.in]: classIds },
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        limit: limit < 1 ? 12 : limit,
        offset: (page - 1) * limit,
        order: [["name", "ASC"]],
      });

    // Generate classes summary
    const classes = teacherClasses.map((tc) => tc.class.name);

    // Prepare student data
    const studentsArray = students.map((student) => ({
      st_id: student.st_id,
      name: student.name,
    }));

    res.json({
      message: "success",
      // totalStudents: totalCount,
      classes,
      students: studentsArray,
      count,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
  getStudentsByTeacher,
};
