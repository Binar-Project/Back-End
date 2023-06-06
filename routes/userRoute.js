const express = require("express");
const userController = require("../controllers/userController");
const verifyAdmin = require("../middleware/authUser");
const verifyUser = require("../middleware/authUser");
const router = express.Router();

router.get("/", verifyUser, verifyAdmin, userController.getAllUsers);
router.get("/:id", verifyUser, verifyAdmin, userController.getUserById);
router.post("/", userController.createUser);
router.patch("/:id", verifyUser, verifyAdmin, userController.updateUser);
router.delete("/:id", verifyUser, verifyAdmin, userController.deleteUser);

module.exports = router;
