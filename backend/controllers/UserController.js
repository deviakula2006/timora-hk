const userData = require("../models/Users");
const jwt = require("jsonwebtoken");

// 🔹 Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await userData.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("Failed to fetch profile");
  }
};

// 🔹 Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = await userData.findOne({ email });

    if (!user) {
      user = await userData.create({
        email,
        name,
        authType: "google"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Google login success",
      token
    });
  } catch (err) {
    res.status(500).json("Google login failed");
  }
};

// 🔹 Email/Password Login
exports.CheckLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userData.findOne({ email });

    if (!result) {
      return res.status(404).json("User not found. Please sign up");
    }

    if (password !== result.password) {
      return res.status(401).json("Invalid credentials");
    }

    const token = jwt.sign(
      { id: result._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (err) {
    res.status(500).json("Login error");
  }
};

// 🔹 Signup
exports.Signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await userData.findOne({ email });

    if (check) {
      return res.status(409).json("User already exists");
    }

    await userData.create({ email, password });

    res.status(201).json("User created successfully");
  } catch (err) {
    res.status(500).json("Signup failed");
  }
};
