const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
  getStudentsByTeacher,
  editStudent,
} = require("../controllers/studentsController");
const authenticate = require("../middlewares/authenticate");

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/", authenticate, addNewStudent);
router.put("/:id", authenticate, editStudent);
router.delete("/:id", authenticate, removeStudent);
router.get("/teacher/:teacherId", getStudentsByTeacher);

module.exports = router;
