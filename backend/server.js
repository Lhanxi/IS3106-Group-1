// Import Core Modules
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

require("dotenv").config();

// Import Configurations and Utility Functions
const connectDB = require("./config/db");

// Route Handlers
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoute");
const forumRoutes = require("./routes/forumRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api", forumRoutes); // KL: check if its supp to be like that

// Database Connection
connectDB();

// Routes Setup
// Base route for checking server status
app.get("/", (req, res) => {
  res.send("API is running...");
});


// Handle Undefined Routes
app.use((req, res) => {
  res.status(404).send("Sorry can't find that!" + req.url);
});

// Error Handling Middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));