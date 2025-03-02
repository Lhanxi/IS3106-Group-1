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

router.get("/:projectId", async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      res.json(project); // Send the full project data
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

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
  
  

module.exports = router;
