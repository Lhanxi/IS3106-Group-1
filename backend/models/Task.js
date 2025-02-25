const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  dueDate: String, 
  //will need to dynamically update the tasks as we add more columns
});

module.exports = mongoose.model("User", userSchema);