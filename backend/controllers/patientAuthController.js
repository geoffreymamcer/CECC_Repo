const PatientAuth = require("../models/patientAuth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerPatient = async (req, res) => {
  try {
    const { firstName, middleName, lastName, username, email, password } =
      req.body;

    // Check if email or username already exists
    const existingUser = await PatientAuth.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    // Create new patient
    const patient = await PatientAuth.create({
      firstName,
      middleName,
      lastName,
      username,
      email,
      password,
    });

    // Create token
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find patient by email
    const patient = await PatientAuth.findOne({ email });
    if (!patient) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, patient.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response
    res.json({
      token,
      user: {
        id: patient._id,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        username: patient.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientAuth.find({}).select("-password");
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
};

module.exports = { registerPatient, loginPatient, getAllPatients };
