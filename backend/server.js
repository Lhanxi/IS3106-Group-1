const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const forumRoutes = require("./routes/forumRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", forumRoutes); // KL: check if its supp to be like that


// Connect to MongoDB
connectDB();

// Sample API Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));