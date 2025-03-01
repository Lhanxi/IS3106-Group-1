const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({
  name: String,
  status: String,
  description: String, 
  startDate: Date,
  dueDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }
});

module.exports = mongoose.model("Task", taskSchema);