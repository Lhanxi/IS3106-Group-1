const mongoose = require("mongoose");

/*
To allow for the most flexible level of storage, the project will only store metadata about tasks.
Each project has:
1. A `name` (required).
2. `defaultAttributes`: An array storing metadata about the attributes (columns) of tasks.
   - `name`: The attribute name (e.g., "status", "priority").
   - `type`: The data type ("text", "number", "dropdown", "date", "people"). These are the only ones that we are currently allowing. 
   - `options`: If the type is "dropdown", this stores the allowed values.
*/

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Project name is mandatory
    defaultAttributes: [
        {
            name: { type: String, required: true },
            type: { 
                type: String, 
                enum: ["text", "number", "dropdown", "date", "people"],
                required: true 
            }, 
            options: { type: [String], default: undefined } // Only used for dropdowns
        }
    ]
});

module.exports = mongoose.model("Project", projectSchema);
