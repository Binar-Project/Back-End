const express = require("express");
const userController = require("../controllers/userController");
const {
  verifyToken,
  verifyAdmin,
  verifyUser,
} = require("../middleware/authUser");
const router = express.Router();

router.get(
  "/",
  verifyToken,
  verifyUser,
  verifyAdmin,
  userController.getAllUsers
);
router.get(
  "/:id",
  verifyToken,
  verifyUser,
  verifyAdmin,
  userController.getUserById
);
router.post("/", userController.createUser);
router.patch(
  "/:id",
  verifyToken,
  verifyUser,
  verifyAdmin,
  userController.updateUser
);
router.delete(
  "/:id",
  verifyToken,
  verifyUser,
  verifyAdmin,
  userController.deleteUser
);

module.exports = router;
