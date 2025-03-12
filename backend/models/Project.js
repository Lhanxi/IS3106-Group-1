const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Project name is mandatory
    people: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Assigned Users
    attributes: [
        {
            name: { type: String, required: true },
            type: { 
                type: String, 
                enum: ["text", "number", "dropdown", "date", "people"],
                required: true 
            }, 
            options: { type: [String], default: undefined } // Only used for dropdowns
        }
    ],
    tasks: [{
        name: { type: String, required: true }, // Task Name
        status: {
            type: String,
            enum: ["Not Started", "In-progress", "Completed"],
            required: true,
            default: "Not Started"
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"], // Ensure priority follows dropdown options
            required: true,
            default: "Medium"
        },
        deadline: { type: Date, required: true },
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Users assigned to task
    }]
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
