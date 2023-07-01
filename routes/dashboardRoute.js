const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboardController");
const { verifyToken, verifyUser } = require("../middleware/authUser");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", verifyToken, verifyUser, dashboard.getAllEvents);
router.get("/:id", verifyToken, verifyUser, dashboard.getEventById);
router.post(
  "/upload",
  verifyToken,
  verifyUser,
  upload.single("img"),
  dashboard.createEvent
);
router.patch("/:id", verifyToken, verifyUser, dashboard.updateEvent);
router.delete("/:id", verifyToken, verifyUser, dashboard.deleteEvent);
router.get("/:filename", dashboard.getImage);

module.exports = router;
