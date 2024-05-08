const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
  getStudentsByTeacher,
} = require("../controllers/studentsController");

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", addNewStudent);
router.delete("/:id", removeStudent);
router.get("/teacher/:teacherId", getStudentsByTeacher);

module.exports = router;
