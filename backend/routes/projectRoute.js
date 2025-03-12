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
     // Send the full project data
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
/*
  router.get("/api/tasks/:projectId/cols", async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId).lean();
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      const columnNames = project.defaultAttributes.map(attr => attr.name);
      res.json(columnNames);
    } catch (error) {
      res.status(500).json({ message: "Error fetching columns" });
    }
  });
  */

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
