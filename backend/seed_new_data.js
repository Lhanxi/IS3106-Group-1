/*
This script was created to seed the information into MongoDB 
*/

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Project = require("./models/Project"); // Import the Project model
const Task = require("./models/Task"); // Import the Task model

dotenv.config(); // Load environment variables

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding..."))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Sample Project Data
const seedProject = {
  name: "New Web App Development",
  defaultAttributes: [
    {
      name: "status",
      type: "text",
    },
    {
      name: "priority",
      type: "dropdown",
      options: ["Low", "Medium", "High"],
    },
    {
      name: "deadline",
      type: "date",
    },
    {
      name: "assignedTo",
      type: "people",
    },
  ],
};

// Function to Seed Data
const insertData = async () => {
  try {
    // Step 2: Create a Project
    const project = await Project.create(seedProject);
    console.log("Project Created:", project);

    if (!project || !project._id) {
      console.error("Project creation failed, aborting task insertion.");
      mongoose.connection.close();
      return;
    }

    // Step 3: Create Tasks Associated with the Project
    const seedTasks = [
      {
        name: "Design Homepage",
        projectId: project._id, // Assign project ID
        attributes: {
          status: "To Do",
          priority: "High",
          deadline: new Date("2025-04-01"),
          assignedTo: "Alice",
        },
      },
      {
        name: "API Development",
        projectId: project._id,
        attributes: {
          status: "In Progress",
          priority: "Medium",
          deadline: new Date("2025-05-01"),
          assignedTo: "Bob",
        },
      },
      {
        name: "Frontend Integration",
        projectId: project._id,
        attributes: {
          status: "Done",
          priority: "Low",
          deadline: new Date("2025-03-01"),
          assignedTo: "Charlie",
        },
      },
    ];

    const insertedTasks = await Task.insertMany(seedTasks);
    console.log("Tasks Inserted:", insertedTasks);

    // Close connection after inserting
    mongoose.connection.close();
    console.log("Seeding completed, MongoDB connection closed.");
  } catch (error) {
    console.error("Error inserting data:", error.message, error);
    mongoose.connection.close();
  }
};

// Run function
insertData();
