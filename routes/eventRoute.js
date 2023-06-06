const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", eventController.getAllEventsGuest);
router.get("/:id", eventController.getEventByIdGuest);
router.get("/search", eventController.searchEventsGuest);

module.exports = router;
