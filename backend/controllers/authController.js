import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT Middleware for Authentication
export const authenticateUser = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "Access Denied. No token provided." });
  }

  // If the token has a 'Bearer ' prefix, remove it
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded token payload (e.g., id and role) to req.user
    req.user = verified;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).json({ msg: "Invalid token." });
  }
};

// Middleware to authorize a specific role (e.g., "NGO")
export const authorizeRole = (role) => {
  return (req, res, next) => {
    // Ensure authenticateUser has set req.user
    if (!req.user) {
      return res.status(401).json({ msg: "User not authenticated." });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ msg: "Forbidden: Insufficient permissions." });
    }
    next();
  };
};

// User Signup
export const signup = async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body); // Debug request payload

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    console.log("Login Request Body:", req.body); // Debug logging

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
