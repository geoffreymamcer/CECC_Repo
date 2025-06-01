import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { firstName, middleName, lastName, phone_number, email, password } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone_number }],
    });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email or phone number already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      firstName,
      middleName,
      lastName,
      phone_number,
      email,
      password: hashedPassword,
      role: "patient", // Default role
      patientId: generatePatientId(),
    });

    // Create profile with all registration info
    await Profile.create({
      patientId: newUser.patientId,
      firstName,
      middleName,
      lastName,
      phone_number,
      email,
      ...req.body,
    });

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      middleName: newUser.middleName,
      lastName: newUser.lastName,
      phone_number: newUser.phone_number,
      email: newUser.email,
      role: newUser.role,
      patientId: newUser.patientId,
    };

    res.status(201).json({
      status: "success",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during signup",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // The user ID is set by the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user data'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if user is a patient
    if (user.role !== "patient") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. This login is for patients only.",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phone_number: user.phone_number,
      email: user.email,
      role: user.role,
      patientId: user.patientId,
    };

    res.status(200).json({
      status: "success",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during login",
    });
  }
};
