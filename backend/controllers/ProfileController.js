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

// Create a new profile
export const createProfile = async (req, res) => {
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

    // Generate a unique patient ID (you can modify this format as needed)
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    // Find the latest patient ID for the current year/month
    const latestProfile = await Profile.findOne(
      { patientId: new RegExp(`CECC${year}${month}`) },
      { patientId: 1 },
      { sort: { patientId: -1 } }
    );

    let sequence = "0001";
    if (latestProfile && latestProfile.patientId) {
      const currentSequence = parseInt(latestProfile.patientId.slice(-4));
      sequence = (currentSequence + 1).toString().padStart(4, "0");
    }

    const patientId = `CECC${year}${month}${sequence}`;

    const profile = new Profile({
      patientId,
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
    });

    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a profile
export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
