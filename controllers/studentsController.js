const { student, parent } = require("../models");

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
const getStudentById = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number.isNaN(id)) {
      return res.status(400);
    }

    let userProfile = await student.findByPk(id);

    if (!userProfile) {
      return res.status(400).json({ error: "Student not found" });
    }

    return res.status(200).json({ message: "success", user: userProfile });
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
      parent_email,
      class_id,
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
      class_id,
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

module.exports = {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
};
