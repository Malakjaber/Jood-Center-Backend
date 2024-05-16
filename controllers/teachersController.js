const { sequelize } = require("../models");

const getAllTeachers = async (req, res) => {
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
      conditions.username = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const teachers = await sequelize.models.teacher.findAll({
      attributes: [
        ["teacher_id", "id"],
        ["username", "username"],
        ["email", "email"],
      ],
      where: conditions,
      order: [["username", "ASC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    const count = await sequelize.models.teacher.count({
      where: conditions,
    });

    return res.status(200).json({ message: "success", count, teachers });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getTeacherById = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number.isNaN(id)) {
      return res.status(400);
    }

    let teacherProfile = await sequelize.models.teacher.findByPk(id);

    if (!teacherProfile) {
      return res.status(400).json({ error: "Teacher Not Found" });
    }

    return res
      .status(200)
      .json({ message: "success", teacher: teacherProfile });
  } catch (error) {
    return res.status(500);
  }
};

module.exports = { getAllTeachers, getTeacherById };
