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
    req.user = verified;
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).json({ msg: "Invalid token." });
  }
  
};

// Middleware to authorize a specific role (e.g., "NGO", "Admin", etc.)
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

// ---------------------------
// User Signup & Login
// ---------------------------

// General User Signup
export const signup = async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body);

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

// General User Login
export const login = async (req, res) => {
  try {
    console.log("Login Request Body:", req.body);

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

// ---------------------------
// Admin Signup & Login
// ---------------------------

/**
 * Admin Signup
 * Forces the role to "Admin" regardless of the payload.
 */
export const adminSignup = async (req, res) => {
  try {
    console.log("Admin Signup Request Body:", req.body);
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, email and password are required" });
    }
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Force the role to Admin
    user = new User({ name, email, password: hashedPassword, role: "Admin" });
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
    console.error("Admin Signup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Admin Login
 * Only allows users with role "Admin" to login via this endpoint.
 */
export const adminLogin = async (req, res) => {
  try {
    console.log("Admin Login Request Body:", req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });
    
    // Ensure the user is an Admin
    if (user.role !== "Admin") {
      return res.status(403).json({ msg: "Not authorized as admin" });
    }
    
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
    console.error("Admin Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
