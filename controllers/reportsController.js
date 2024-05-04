const { reports } = require("../models");

const getReports = async (req, res) => {
  try {
    const { id, st_id, teacher_id, grade_id, date } = req.body;

    const conditions = {};

    if (!id && !st_id && !teacher_id && !grade_id && !date) {
      return res.status(400);
    }
    if (id) {
      conditions.id = id;
    } else if (st_id) {
      conditions.st_id = st_id;
    } else if (teacher_id) {
      conditions.teacher_id = teacher_id;
    } else if (grade_id) {
      conditions.teacher_id = teacher_id;
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

module.exports = { getReports };
