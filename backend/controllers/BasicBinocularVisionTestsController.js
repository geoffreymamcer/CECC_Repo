// controllers/BasicBinocularVisionTestsController.js
import BasicBinocularVisionTests from "../models/BasicBinocularVisionTests.js";
import Profile from "../models/Profile.js";

export const createBasicBinocularVisionTests = async (req, res) => {
  try {
    const { patientId } = req.body;

    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const tests = await BasicBinocularVisionTests.create(req.body);

    profile.basicBinocularVisionTests = tests._id;
    await profile.save();

    res.status(201).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBasicBinocularVisionTestsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const tests = await BasicBinocularVisionTests.findOne({ patientId });
    if (!tests) {
      return res
        .status(404)
        .json({ message: "Basic binocular vision tests not found" });
    }
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
