const Profile = require("../models/Profile");
const User = require("../models/User");

exports.createProfile = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dob,
      age,
      gender,
      address,
      contact,
      occupation,
      civilStatus,
      referralBy,
      ageCategory,

      ocularHistory,
      healthHistory,
      familyMedicalHistory,
      medications,
      allergies,
      occupationalHistory,
      digitalHistory,

      chiefComplaint,
      associatedComplaint,
      diagnosis,
      treatmentPlan,
    } = req.body;

    // Find matching user
    const matchingUser = await User.findOne({
      firstName,
      middleName,
      lastName,
    });

    const profileData = {
      ...req.body,
      userId: matchingUser ? matchingUser._id : null,
    };

    const profile = await Profile.create(profileData);

    res.status(201).json({
      status: "success",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
