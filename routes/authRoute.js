const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken, verifyUser } = require("../middleware/authUser");

const router = express.Router();

router.post("/login", authController.Login);
router.get("/dashboard", verifyToken, verifyUser, authController.Dashboard);
router.delete("/logout", authController.Logout);

module.exports = router;
