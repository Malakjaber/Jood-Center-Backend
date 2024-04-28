const express = require("express");
const {
  getAllUsers,
  signUp,
  signIn,
  signOut,
  getUserById,
} = require("../controllers/usersController.js");
const authenticate = require("../middlewares/authenticate.js");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/signup", signUp);
router.post("/signin", signIn);
router.put("/signout", authenticate, signOut);

module.exports = router;
