const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
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

    // Create new user
    const newUser = await User.create({
      firstName,
      middleName,
      lastName,
      phone_number,
      email,
      password,
      role: "patient", // Default role
    });

    // Create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        middleName: newUser.middleName,
        lastName: newUser.lastName,
        phone_number: newUser.phone_number,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
