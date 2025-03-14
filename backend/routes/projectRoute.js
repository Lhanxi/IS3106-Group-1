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

// Route to search for projects where the userId is in the 'people' array
router.get('/projects/by-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all projects where the people array contains the userId
    const projects = await Project.find({
      people: userId  // MongoDB query to find projects where 'people' array contains 'userId'
    });

    // If no projects found, return a message
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    // Return the found projects
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


// POST endpoint to create a new project
router.post('/new-project', async (req, res) => {
  const { name, people, tasks } = req.body;

  // Validate that required fields are provided
  if (!name || !people || !Array.isArray(people)) {
    return res.status(400).json({ message: 'Project name and people are required.' });
  }

  // Optionally: Check if all provided people IDs are valid users
  try {
    // Create the new project
    const newProject = new Project({
      name,
      people,
      attributes: [
        //by default they will have these attributes
        { name: 'Name', type: 'text' },
        { name: 'Status', type: 'dropdown', options: ['Not Started', 'In-progress', 'Completed'] },
        { name: 'Priority', type: 'dropdown', options: ['Low', 'Medium', 'High'] },
        { name: 'Deadline', type: 'date' },
        { name: 'AssignedTo', type: 'people' },
      ],
      tasks: tasks || [],
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

module.exports = router;
