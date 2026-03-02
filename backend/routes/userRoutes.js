const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ✅ Import BOTH protect and authorizeRoles
const { protect, authorizeRoles } = require("../middleware/authMiddleware");


// Get current logged in user
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});


// Get all users - Admin only
router.get("/", protect, authorizeRoles("owner","employee"), async (req, res) => {

  try {

    const users = await User.find();

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// Create new user
router.post("/", async (req, res) => {

  console.log("Incoming request body:", req.body);

  const user = new User(req.body);

  try {

    const newUser = await user.save();

    console.log("User saved successfully:", newUser);

    res.status(201).json(newUser);

  } catch (error) {

    console.error("Error saving user:", error.message);

    res.status(400).json({
      message: error.message
    });

  }

});


// Test route
router.get("/test", async (req, res) => {

  try {

    const testUser = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "testpassword",
      role: "user"
    });

    const savedUser = await testUser.save();

    res.status(201).json({
      message: "Test user created successfully",
      user: savedUser
    });

  } catch (error) {

    res.status(500).json({
      message: "Error connecting to database",
      error: error.message
    });

  }

});


module.exports = router;