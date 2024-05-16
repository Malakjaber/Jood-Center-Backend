const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  addNewClass,
  getClassesInformation,
  removeClass,
} = require("../controllers/classesController");

router.get("/", getAllClasses);
router.get("/details", getClassesInformation);
router.get("/:id", getClassById);
router.post("/", addNewClass);
router.delete("/:id", removeClass);

module.exports = router;
