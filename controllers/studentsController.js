const { where } = require("sequelize");
const { student, parent, grade } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAllStudents = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    if (page < 0) {
      page = 1;
    }
    if (limit > 160 || limit < 0) {
      limit = 9;
    }

    const search = req.query.search;
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

    return res.status(200).json({ message: "success", students });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
const getStudentById = (req, res) => {};
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
      parent_email,
    } = req.body;

    if (await student.findByPk(st_id)) {
      return res.status(400).json({ error: "Student Added Before" });
    }

    const st_parent = await parent.findOne({
      where: {
        email: parent_email,
      },
    });

    const newStudent = await student.create({
      st_id,
      name,
      birth_date,
      pathological_case,
      phone,
      address,
      medicines,
      grade_id: "2",
      parent_id: st_parent ? st_parent.parent_id : null,
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
const removeStudent = (req, res) => {};

module.exports = {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
};
