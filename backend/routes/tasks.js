const express = require("express");
const Task = require("../models/Task"); 

const router = express.Router();

router.get("/:projectId/statuses", async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const statuses = await Task.distinct("status", { projectId });

        res.json(statuses); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:projectId/tasks", async (req, res) => {
    try {
        const projectId = req.params.projectId; 
        const tasks = await Task.find({ projectId }); 
        res.json(tasks);
    } catch (error) {
        console.error(error); 
        res.status(500).json({error : "error retrieving the tasks"});
    }
})

module.exports = router;