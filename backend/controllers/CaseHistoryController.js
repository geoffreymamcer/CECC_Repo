// controllers/CaseHistoryController.js
import CaseHistory from "../models/CaseHistory.js";
import Profile from "../models/Profile.js";

export const createCaseHistory = async (req, res) => {
  try {
    const { patientId } = req.body;

    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const caseHistory = await CaseHistory.create(req.body);

    profile.caseHistory = caseHistory._id;
    await profile.save();

    res.status(201).json(caseHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCaseHistoryByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const caseHistory = await CaseHistory.findOne({ patientId });
    if (!caseHistory) {
      return res.status(404).json({ message: "Case history not found" });
    }
    res.status(200).json(caseHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertCaseHistoryByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = req.body;

    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const caseHistory = await CaseHistory.findOneAndUpdate(
      { patientId: patientId },
      { ...data, patientId: patientId },
      { new: true, upsert: true, runValidators: true }
    );

    if (!profile.caseHistory) {
      profile.caseHistory = caseHistory._id;
      await profile.save();
    }

    res.status(200).json(caseHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
