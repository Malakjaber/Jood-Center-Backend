const express = require("express");
const router = express.Router();
const {
  getReports,
  //   getClassById,
  //   addNewClass,
  //   removeClass,
} = require("../controllers/reportsController");

router.get("/", getReports);
// router.get("/:id", getClassById);
// router.post("/", addNewClass);
// router.delete("/:id", removeClass);

module.exports = router;
