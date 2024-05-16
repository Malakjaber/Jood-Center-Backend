const express = require("express");
const router = express.Router();
const {
  getAllCoManagers,
  getCoManagerById,
} = require("../controllers/coManagersController");

router.get("/", getAllCoManagers);
router.get("/:id", getCoManagerById);

module.exports = router;
