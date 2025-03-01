const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  agenda: [String],
  preparation: [{
    item: String,
    responsible: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }],
  summary: String,
  actionItems: [{
    item: String,
    responsible: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }],
  link: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }
});

module.exports = mongoose.model("Meeting", meetingSchema);