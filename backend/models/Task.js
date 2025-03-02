const mongoose = require("mongoose");

/*
Tasks will:
1. Belong to a project (`projectId`).
2. Have a `name` (required).
3. Store all dynamic attributes as key-value pairs in the `attributes` field.
*/

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Every task must have a name
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }, // Link to Project
  attributes: { type: mongoose.Schema.Types.Mixed, default: {} } // Dynamic attributes
});

module.exports = mongoose.model("Task", taskSchema);
