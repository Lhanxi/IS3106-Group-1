const express = require("express"); 
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Create a User (Test)
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Users (Test)
router.get("/users", async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/users/login - Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) { // Assuming password check logic
          res.json({
              _id: user._id,
              email: user.email,
              // token: generateToken(user._id), // Assuming JWT token generation, not added in model, do we need?
          });
      } else {
          res.status(401).json({ message: "Invalid email or password" });
      }
  } catch (error) {
      res.status(500).json({ message: "Server error" + req.url + error});
  }
});

// POST /api/users/signup - Register a new user
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
      const userExists = await User.findOne({ email });
      if (userExists) {
          res.status(400).json({ message: "User already exists" });
      } else {
          const user = new User({
              email,
              password // Ensure password hashing is handled
          });
          await user.save();
          res.status(201).json({
              _id: user._id,
              email: user.email,
              // token: generateToken(user._id),
          });
      }
  } catch (error) {
      res.status(500).json({ message: "Server error" + req.url + error});
  }
});


module.exports = router;
