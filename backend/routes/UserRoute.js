const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const userController = require("../controllers/UserController");

router.post("/login", userController.CheckLogin);
router.post("/signup", userController.Signup);
router.post("/google-login", userController.googleLogin);

// 🔐 Protected route
router.get("/profile", auth, userController.getProfile);

module.exports = router;
