const express = require("express");
const router = express.Router();
const Project = require("../models/Project"); 

// Correct route definition
router.get("/:projectId/name", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).select("name"); // Fetch only the 'name' field

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ name: project.name });
  } catch (error) {
    console.error("Error fetching project name:", error);
    res.status(500).json({ message: "Internal server error" });
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
  


  router.get("/:projectId/cols", async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log(`Fetching columns for project: ${projectId}`);

        // Get the project using the projectId
        const project = await Project.findById(projectId).lean();
        if (!project) {
            console.log("Project not found");
            return res.status(404).json({ message: "Project not found" });
        }

        // Extract top-level fields and attributes
        const topLevelFields = ["name", "projectId"]; // Only include these top-level fields
        const attributeKeys = project.defaultAttributes.map(attr => attr.name); // Get attribute names from defaultAttributes

        // Combine top-level fields with attribute names
        const columnNames = [...topLevelFields, ...attributeKeys];

        console.log("Final column list:", columnNames);

        // Return the final list of column names
        res.json(columnNames);
    } catch (error) {
        console.error("Error fetching columns:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



  
router.post("/:projectId/add-column", async (req, res) => {
  const { projectId } = req.params;
  const { columnName, columnType, dropdownOptions } = req.body;

  try {
    // Step 1: Add the column to the project metadata (defaultAttributes)
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newColumn = {
      name: columnName,
      type: columnType,
      options: columnType === "dropdown" ? dropdownOptions : [] // If it's a dropdown, add options
    };

    // Add the new column to the project's defaultAttributes
    project.defaultAttributes.push(newColumn);
    await project.save();

    // Step 2: If it's a task, update all tasks in the project to reflect the new column
    await Task.updateMany(
      { projectId },
      {
        $set: {
          [`attributes.${columnName}`]: columnType === "dropdown" ? dropdownOptions[0] : "" // Set default value for tasks
        }
      }
    );

    res.status(200).json({ message: "Column added to project and tasks" });
  } catch (error) {
    console.error("Error adding column:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
