const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
} = require("../controllers/studentsController");

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/add", addNewStudent);
router.delete("/remove/:id", removeStudent);

module.exports = router;
