const express = require("express");
const router = express.Router();
const {
  getAllTeachers,
  getTeacherById,
} = require("../controllers/teachersController");

router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);

module.exports = router;
