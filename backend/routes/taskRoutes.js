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

module.exports = router;