const {
  fillStudentsTable,
  fillClassesTable,
  fillTeachersTable,
  fillCoManagersTable,
} = require("../utils/fakerRoutes.js");
const express = require("express");

const router = express.Router();

router.post("/students", fillStudentsTable);
router.post("/classes", fillClassesTable);
router.post("/teachers", fillTeachersTable);
router.post("/coManager", fillCoManagersTable);
module.exports = router;
