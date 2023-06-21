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

router.get("/", verifyUser, dashboard.getAllEvents);
router.get("/:id", verifyUser, dashboard.getEventById);
router.post("/upload", upload.single("img"), dashboard.createEvent);
router.patch("/:id", verifyUser, dashboard.updateEvent);
router.delete("/:id", verifyUser, dashboard.deleteEvent);
router.get("/:filename", dashboard.getImage);

module.exports = router;
