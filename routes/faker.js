const {
  fillStudentsTable,
  fillClassesTable,
  fillTeachersTable,
} = require("../utils/fakerRoutes.js");
const express = require("express");

const router = express.Router();

router.post("/students", fillStudentsTable);
router.post("/classes", fillClassesTable);
router.post("/teachers", fillTeachersTable);

module.exports = router;
