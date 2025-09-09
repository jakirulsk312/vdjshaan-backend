const Event = require("../models/Event");

// @desc Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("❌ Get Events Error:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// @desc Add new event
const addEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("❌ Add Event Error:", err);
    res.status(500).json({ message: "Failed to add event" });
  }
};

// @desc Update event
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.json(updatedEvent);
  } catch (err) {
    console.error("❌ Update Event Error:", err);
    res.status(500).json({ message: "Failed to update event" });
  }
};

// @desc Delete event
const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent)
      return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Event Error:", err);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

module.exports = {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
};
