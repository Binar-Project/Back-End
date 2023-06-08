const express = require("express");
const router = express.Router();
const dashboard = require("../controllers/dashboardController");
const verifyUser = require("../middleware/authUser");


router.get("/", verifyUser, dashboard.getAllEvents);
router.get("/:id", verifyUser, dashboard.getEventById);
router.post("/", verifyUser, dashboard.createEvent);
router.patch("/:id", verifyUser, dashboard.updateEvent);
router.delete("/:id", verifyUser, dashboard.deleteEvent);

module.exports = router;
