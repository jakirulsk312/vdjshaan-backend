const express = require("express");
const {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", getEvents);
router.post("/", addEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
