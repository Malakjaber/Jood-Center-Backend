const { Op } = require("sequelize");
const { sequelize } = require("../models");

const getAllCoManagers = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;
    let id = req.query.id;

    if (page < 0) {
      page = 1;
    }
    if (limit > 160 || limit < 0) {
      limit = 12;
    }

    let search = req.query.search;
    let conditions = {};
    if (id) {
      conditions.id = id;
    }
    if (search) {
      search = search.toString();
      conditions.username = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const co_managers = await sequelize.models.co_manager.findAll({
      where: conditions,
      order: [["username", "ASC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    const count = await sequelize.models.co_manager.count({
      where: conditions,
    });

    return res.status(200).json({ message: "success", count, co_managers });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getCoManagerById = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number.isNaN(id)) {
      return res.status(400);
    }

    let coManager = await sequelize.models.co_manager.findByPk(id);

    if (!coManager) {
      return res.status(400).json({ error: "Co-Manager Not Found" });
    }

    return res.status(200).json({ message: "success", co_manager: coManager });
  } catch (error) {
    return res.status(500);
  }
};

module.exports = { getAllCoManagers, getCoManagerById };
