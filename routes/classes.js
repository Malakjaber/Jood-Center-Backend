const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  addNewClass,
  getClassesInformation,
  removeClass,
  editClass,
} = require("../controllers/classesController");
const authenticate = require("../middlewares/authenticate");

router.get("/", getAllClasses);
router.get("/details", getClassesInformation);
router.get("/:id", getClassById);
router.post("/", addNewClass);
router.put("/:id", editClass);
router.delete("/:id", authenticate, removeClass);

module.exports = router;
