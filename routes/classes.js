const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  addNewClass,
  removeClass,
} = require("../controllers/classesController");

router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.post("/", addNewClass);
router.delete("/:id", removeClass);

module.exports = router;
