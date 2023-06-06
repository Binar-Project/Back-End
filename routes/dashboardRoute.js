const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboardController");
const verifyUser = require("../middleware/authUser");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets");
  },
  filename: (req, file, cb) => {
    const sanitizeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}-${sanitizeName}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", verifyUser, dashboard.getAllEvents);
router.get("/:id", verifyUser, dashboard.getEventById);
router.post("/", upload.single("img"), verifyUser, dashboard.createEvent);
router.patch("/:id", verifyUser, dashboard.updateEvent);
router.delete("/:id", verifyUser, dashboard.deleteEvent);

module.exports = router;
