const express = require("express");
const router = express.Router();
const Project = require("../models/Project"); 
const User = require("../models/User");




router.get("/:projectId", async (req, res) => {
     // Get the full project
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.patch("/:projectId/update-task/:taskId", async (req, res) => {
    try {
      const { projectId, taskId } = req.params;
      const { field, newValue } = req.body; // Expecting field name and new value
  
      console.log("Received update request:", { projectId, taskId, field, newValue });
  
      // Fetch the project
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Find the task within the project
      const taskIndex = project.tasks.findIndex((task) => task._id.toString() === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Debug: Log task before updating
      console.log("Before update:", project.tasks[taskIndex]);
  
      // Update the specific field in the task
      project.tasks[taskIndex][field] = newValue;
  
      // Save the updated project
      await project.save();
  
      // Debug: Log updated task
      console.log("After update:", project.tasks[taskIndex]);
  
      res.status(200).json({ message: "Task updated successfully", updatedTask: project.tasks[taskIndex] });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

  router.get("/:projectId/people", async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Find the project by ID and populate the "people" field
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      // Get all users from the database
      const allUsers = await User.find({}, "_id firstName lastName");
  
      // Filter only the users present in project.people
      const peopleMap = {};
      allUsers.forEach(user => {
        if (project.people.includes(user._id.toString())) {
          peopleMap[user._id] = `${user.firstName} ${user.lastName}`;
        }
      });
  
      res.json(peopleMap);
    } catch (error) {
      console.error("Error fetching people:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  //returns the list of projects that the user belongs to 
router.get("/:userId/getProjects", async (req, res) => {
  try {
    const projects = await Project.find({ members: userId });
    return projects;
  } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
  }
});



module.exports = router;
