const express = require("express");
const router = express.Router();
const {
  getReports,
  createReport,
} = require("../controllers/reportsController");

router.get("/", getReports);
router.post("/", async (req, res) => {
  const { content, date, classId, teacherId } = req.body;
  const result = await createReport(content, date, classId, teacherId);
  if (result.error) {
    res.status(400).json({ message: result.message });
  } else {
    res.status(201).json(result);
  }
});
module.exports = router;
