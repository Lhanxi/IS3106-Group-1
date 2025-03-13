const express = require("express"); 
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const router = express.Router();

// Helper function to generate JWT
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Adjust the expiry as necessary
  });
};

// Get all Users (Test)
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log('User found:', user);
    console.log("Plain password:", password);
    console.log("Hashed password from DB:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password matches:', isMatch);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Server error" + req.url + error});
  }
});

// Backend: Node.js/Express - User Signup Route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all required fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed password on signup:", hashedPassword);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.email);
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      token
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error processing your request" });
  }
});




module.exports = router;
