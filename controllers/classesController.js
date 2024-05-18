const { class: classes, teacher_class } = require("../models");
const { sequelize } = require("../models");
const { models } = sequelize;

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
    const { name, teacher_id } = req.body;
    console.log(req.body);
    const newClass = await classes.create({
      name: name,
    });

    if (teacher_id) {
      await teacher_class.create({
        teacher_id: teacher_id,
        class_id: newClass.class_id,
      });
    }

    res.json({
      message: "success",
      newClass,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

async function getClassesInformation(req, res) {
  try {
    let class_id = req.query.class_id;
    let whereCondition = {};

    if (class_id) {
      whereCondition.class_id = class_id;
    }

    const classesInfo = await models.class.findAll({
      where: whereCondition,
      include: [
        {
          model: models.student,
          attributes: [], // No attributes needed from students, just the count
          duplicating: false, // Avoid duplicating class entries due to multiple students
        },
        {
          model: models.teacher_class,
          attributes: [], // No attributes needed from teacher_class directly
          include: [
            {
              model: models.teacher,
              attributes: ["username"], // Only need the teacher's username
            },
          ],
        },
      ],
      attributes: [
        "name", // Direct attribute from class
        "class_id",
        [
          sequelize.fn("COUNT", sequelize.col("students.st_id")),
          "studentCount",
        ],
      ],
      group: [
        "class.class_id",
        "teacher_classes.teacher_id",
        "teacher_classes->teacher.teacher_id",
      ],
      raw: true,
      subQuery: false, // This might be necessary to handle limitations in grouping
    });

    const data = classesInfo.map((ci) => ({
      class_id: ci["class_id"],
      className: ci["name"],
      studentCount: ci["studentCount"],
      teacherName: ci["teacher_classes.teacher.username"],
    }));

    return res.status(200).json({ message: "success", data });
  } catch (error) {
    console.error("Error fetching class information:", error);
    throw error;
  }
}

const editClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, teacher_id } = req.body;

    const classToUpdate = await classes.findByPk(id);
    if (!classToUpdate) {
      return res.status(404).json({ error: "Class not found" });
    }

    await classToUpdate.update({ name });

    if (teacher_id) {
      // Check if the class already has an assigned teacher
      const existingTeacherClass = await teacher_class.findOne({
        where: { class_id: id },
      });

      if (existingTeacherClass) {
        // Update the existing teacher assignment
        await existingTeacherClass.update({ teacher_id });
      } else {
        // Create a new teacher assignment
        await teacher_class.create({
          teacher_id,
          class_id: id,
        });
      }
    }

    res.json({ message: "success", class: classToUpdate });
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
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllClasses,
  getClassById,
  addNewClass,
  getClassesInformation,
  editClass,
  removeClass,
};
