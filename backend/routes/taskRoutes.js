const express = require("express");
const mongoose = require("mongoose"); 
const Task = require("../models/Task"); 

const router = express.Router();

// Route to retrieve task schema fields based on projectId
router.get("/:projectId/task-schema", async (req, res) => {
    try {
        const { projectId } = req.params;

        // Find any task belonging to the given project
        const tasks = await Task.find({ projectId: new mongoose.Types.ObjectId(projectId) });

        let schemaFields;

        if (tasks.length > 0) {
            // If tasks exist, extract unique attributes
            const uniqueAttributes = new Set();
            tasks.forEach(task => {
                Object.keys(task.toObject()).forEach(key => uniqueAttributes.add(key));
            });

            schemaFields = Array.from(uniqueAttributes).filter(field => field !== "_id" && field !== "__v");
        } else {
            // If no tasks exist, return default attributes
            schemaFields = ["name", "status", "description", "assignedTo", "dueDate"];
        }

        res.json(schemaFields);
    } catch (error) {
        console.error("Error retrieving task schema fields:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to retrieve statuses based on projectId
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

// Route to retrieve tasks based on projectId
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

// Route to retrieve attribute fields based on projectId (jeremy)
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


// Route to add attribute fields
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

  // Route to create new task based on projectId
  router.post("/:projectId/tasks", async (req, res) => {
    try {
        const { projectId } = req.params;
        const taskData = req.body;
        taskData.projectId = new mongoose.Types.ObjectId(projectId);

        // Convert dynamic fields into key-value pairs
        if (taskData.dynamicFields) {
            taskData.dynamicFields.forEach(field => {
                taskData[field.name] = field.value;
            });
            delete taskData.dynamicFields;
        }

        const newTask = new Task(taskData);
        await newTask.save();

        res.status(201).json({ message: "Task created successfully!", task: newTask });
    } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ error: "Internal Server Error" });
    }
   });

  // editing an existing task
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