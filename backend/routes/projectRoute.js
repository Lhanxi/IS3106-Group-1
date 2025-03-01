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

module.exports = router;
