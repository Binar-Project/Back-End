const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.getAllEventsGuest);
router.get("/:id", eventController.getEventByIdGuest);
router.get("/search", eventController.searchEventsGuest);

module.exports = router;
