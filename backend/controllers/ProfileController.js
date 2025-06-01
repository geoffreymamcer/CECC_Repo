import Profile from "../models/Profile.js";

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile by patient ID
export const getProfileByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const profile = await Profile.findOne({ patientId });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching profile",
    });
  }
};

// Create new profile
export const createProfile = async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating profile",
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    const profile = await Profile.findOneAndUpdate({ patientId }, req.body, {
      new: true,
    });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating profile",
    });
  }
};

// Delete a profile
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
