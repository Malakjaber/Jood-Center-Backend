const express = require("express");
const {
  getClassesByTeacherId,
  getTeacherByClassId,
} = require("../controllers/teacherClassController.js");

const router = express.Router();

router.get("/:id", getClassesByTeacherId);
// router.get("/:id", getTeacherByClassId);

module.exports = router;
