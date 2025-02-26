const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: String,
}) 

modules.export = mongoose.model("Project", projectSchema);