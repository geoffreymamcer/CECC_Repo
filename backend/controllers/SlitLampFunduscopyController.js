// controllers/SlitLampFunduscopyController.js
import SlitLampFunduscopy from "../models/SlitLampFunduscopy.js";
import Profile from "../models/Profile.js";

// Create a new Slit Lamp and Funduscopy record
export const createSlitLampFunduscopy = async (req, res) => {
  try {
    const { patientId } = req.body;

    // Check if a profile exists for the given patientId
    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Create the new examination record
    const examination = await SlitLampFunduscopy.create(req.body);

    // Link the new record to the patient's profile
    profile.slitLampFunduscopy = examination._id;
    await profile.save();

    res.status(201).json(examination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Slit Lamp and Funduscopy record by patient ID
export const getSlitLampFunduscopyByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const examination = await SlitLampFunduscopy.findOne({ patientId });

    if (!examination) {
      return res
        .status(404)
        .json({ message: "Slit Lamp and Funduscopy examination not found" });
    }

    res.status(200).json(examination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
