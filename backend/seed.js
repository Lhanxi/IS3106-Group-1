const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Project = require("./models/Project");
const User = require("./models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB!");

        // Clear existing data
        await Project.deleteMany({});
        await User.deleteMany({});

        // Create some users
        const users = await User.insertMany([
            {
                firstName: "Alice",
                lastName: "Johnson",
                preferredName: "Alice",
                email: "alice@example.com",
                password: await hashPassword("password123"),
                jobRole: "Project Manager",
                phoneNumber: "91234567",
                profilePicture: "alice.jpg"
            },
            {
                firstName: "Bob",
                lastName: "Smith",
                preferredName: "Bob",
                email: "bob@example.com",
                password: await hashPassword("password123"),
                jobRole: "Frontend Developer",
                phoneNumber: "92345678",
                profilePicture: "bob.jpg"
            },
            {
                firstName: "Charlie",
                lastName: "Davis",
                preferredName: "Charlie",
                email: "charlie@example.com",
                password: await hashPassword("password123"),
                jobRole: "Backend Developer",
                phoneNumber: "93456789",
                profilePicture: "charlie.jpg"
            }
        ]);

        console.log("Users seeded:", users);

        // Create a sample project
        const project = await Project.create({
            name: "Website Redesign",
            people: users.map(user => user._id),
            attributes: [
                { name: "Name", type: "text" },
                { name: "Status", type: "dropdown", options: ["Not Started", "In-progress", "Completed"] },
                { name: "Priority", type: "dropdown", options: ["Low", "Medium", "High"] },
                { name: "Deadline", type: "date" },
                { name: "AssignedTo", type: "people" }
            ],
            tasks: [
                {
                    name: "Create Wireframes",
                    status: "Not Started",
                    priority: "High",
                    deadline: new Date("2025-03-20T00:00:00.000Z").toISOString(),
                    assignedTo: [users[0]._id]
                },
                {
                    name: "Develop Frontend",
                    status: "In-progress",
                    priority: "Medium",
                    deadline: new Date("2025-04-01T00:00:00.000Z").toISOString(),
                    assignedTo: [users[1]._id]
                },
                {
                    name: "Setup Backend",
                    status: "Completed",
                    priority: "Low",
                    deadline: new Date("2025-03-15T00:00:00.000Z").toISOString(),
                    assignedTo: [users[2]._id]
                }
            ]
        });

        console.log("Project seeded:", project);

        mongoose.connection.close();
        console.log("Database seeding completed!");
    } catch (error) {
        console.error("Error seeding database:", error);
        mongoose.connection.close();
    }
}

seedDatabase();
