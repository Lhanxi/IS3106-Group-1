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

// Initialize Express App
const app = express();

// Middleware
app.use(cors()); // Enable all CORS requests
app.use(express.json()); // Parse JSON bodies

// Database Connection
connectDB();

// Routes Setup
// Base route for checking server status
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Handle Undefined Routes
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!" + req.url);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));