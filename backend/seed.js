/*
This script was created to seed the information into mongoDB 
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
        status: "To Do",
        description: "Create a wireframe for the homepage.",
        projectId: project._id, // Assign project ID
      },
      {
        name: "API Development",
        status: "In Progress",
        description: "Build the backend API endpoints.",
        projectId: project._id,
      },
      {
        name: "Frontend Integration",
        status: "Done",
        description: "Integrate API with React frontend.",
        projectId: project._id,
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
