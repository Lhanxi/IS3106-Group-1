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

router.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Extract the new status from the request

    try {
        // Find the task by ID and update its status
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Returns the updated task
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updatedTask); // Send back the updated task
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;