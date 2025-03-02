const express = require("express");
const mongoose = require("mongoose"); 
const Task = require("../models/Task"); 

const router = express.Router();

router.get("/:projectId/statuses", async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log("Received projectId:", projectId);

        // Convert projectId to ObjectId
        const objectId = new mongoose.Types.ObjectId(projectId);

        // Fetch distinct statuses
        const statuses = await Task.distinct("status", { projectId: objectId });
        console.log("Statuses found:", statuses);

        res.json(statuses);
    } catch (error) {
        console.error("Error fetching statuses:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/:projectId/tasks", async (req, res) => {
    try {
        const projectId = req.params.projectId; 
        const tasks = await Task.find({ projectId: new mongoose.Types.ObjectId(projectId) });
        res.json(tasks);
    } catch (error) {
        console.error(error); 
        res.status(500).json({error : "error retrieving the tasks"});
    }
})

//will need to remove this once the set up is complete
router.get("/:projectId/cols", async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const tasks = await Task.find({ projectId: new mongoose.Types.ObjectId(projectId) });

        if (tasks.length === 0) {
            return res.json([]); 
        }

        const uniqueAttributes = new Set();
        tasks.forEach(task => {
            Object.keys(task.toObject()).forEach(key => uniqueAttributes.add(key));
        });

        res.json(Array.from(uniqueAttributes)); 
    } catch (error) {
        console.error("Error fetching distinct attributes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post("/:projectId/add-attribute", async (req, res) => {
    const { projectId } = req.params;
    const { attributeName, defaultValue } = req.body;
  
    try {
      if (!attributeName) {
        return res.status(400).json({ error: "Attribute name is required" });
      }
  
      // Update all tasks belonging to the project, adding the new field
      await Task.updateMany(
        { projectId },
        { $set: { [attributeName]: defaultValue } } // Dynamically add the new field
      );
  
      res.status(200).json({ message: "Attribute added to all tasks" });
    } catch (error) {
      console.error("Error adding attribute:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
  router.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body; // Accept all fields dynamically

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            updatedFields, // Apply all fields from req.body
            { new: true, runValidators: true } // Return updated task & apply validators
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;