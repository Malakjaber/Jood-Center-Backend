const {
  fillStudentsTable,
  fillClassesTable,
} = require("../utils/fakerRoutes.js");
const express = require("express");

const router = express.Router();

router.post("/students", fillStudentsTable);
router.post("/classes", fillClassesTable);

module.exports = router;
