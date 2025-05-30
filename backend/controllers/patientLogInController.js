const PatientAuth = require("../models/patientAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const patient = await PatientAuth.findOne({ email });
    if (!patient) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, patient.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: patient._id,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        role: "patient",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { loginPatient };
