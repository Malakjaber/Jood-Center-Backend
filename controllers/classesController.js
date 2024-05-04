const { class: classes } = require("../models");

const getAllClasses = async (req, res) => {
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

    const data = await classes.findAll({
      where: conditions,
      order: [["class_id", "ASC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getClassById = async (req, res) => {
  try {
    const id = req.params.id;

    if (Number.isNaN(id)) {
      return res.status(400);
    }

    let data = await classes.findByPk(id);

    if (!data) {
      return res.status(400).json({ error: "Class not found" });
    }

    return res.status(200).json({ message: "success", class: data });
  } catch (error) {
    return res.status(500);
  }
};

const addNewClass = async (req, res) => {
  try {
    const { name } = req.body;

    const newClass = await classes.create({
      name,
    });

    res.json({
      message: "success",
      newClass,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const removeClass = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedClass = await classes.destroy({
      where: { class_id: id },
    });
    if (deletedClass === 0) {
      return res.status(404).json({ error: "Class ID not found" });
    }
    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  addNewClass,
  removeClass,
};
