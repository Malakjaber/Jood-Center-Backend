const { teacher, parent, manager, co_manager } = require("../models");
const {
  signupSchema,
  signinSchema,
  changepassSchema,
} = require("../validators/validations.js");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    let role = req.query.role;

    if (!role) {
      return res.status(400).json({ message: "You should select a role" });
    }

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
      conditions.username = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const users = [];

    switch (role) {
      case "parent":
        users = await parent.findAll({
          where: conditions,
          order: [["parent_id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      case "teacher":
        users = await teacher.findAll({
          where: conditions,
          order: [["teacher_id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      case "manager":
        users = await manager.findAll({
          where: conditions,
          order: [["id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      case "co_manager":
        users = await co_manager.findAll({
          where: conditions,
          order: [["id", "ASC"]],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
        break;
      default:
        break;
    }

    return res.status(200).json({ message: "success", users: users });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = { getAllUsers };
