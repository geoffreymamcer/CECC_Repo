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

// Get profile by patient ID - now using _id directly
export const getProfileByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    // Since we're now using the custom ID format as the _id field
    const profile = await Profile.findById(patientId);

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
    const { _id } = req.body;
    
    // Check for duplicate profile by _id
    const existingProfile = await Profile.findById(_id);
    if (existingProfile) {
      return res.status(400).json({
        status: "error",
        message: "Profile already exists for this ID",
      });
    }
    
    // Set patientId to _id for backward compatibility if not provided
    if (!req.body.patientId && _id) {
      req.body.patientId = _id;
    }
    
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
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle profile picture update
    if (updateData.profilePicture) {
      // Validate base64 image
      if (!updateData.profilePicture.startsWith("data:image")) {
        return res.status(400).json({
          status: "error",
          message: "Invalid image format. Please upload a valid image.",
        });
      }
    }

    const profile = await Profile.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
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

// Get profile for the logged-in user
export const getMyProfile = async (req, res) => {
  try {
    // The user ID is now directly the custom ID for patients
    const profile = await Profile.findById(req.user.id);
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found for current user" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
