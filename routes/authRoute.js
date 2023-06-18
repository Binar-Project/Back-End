const express = require("express");
const authController = require("../controllers/authController");
const { verify } = require("argon2");

const router = express.Router();

router.post("/login", authController.Login);
router.get("/dashboard", verify, authController.Dashboard);
router.delete("/logout", verify, authController.Logout);

module.exports = router;
