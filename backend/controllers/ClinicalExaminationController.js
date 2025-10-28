// controllers/ClinicalExaminationController.js
import ClinicalExamination from "../models/ClinicalExamination.js";
import Profile from "../models/Profile.js";

export const createClinicalExamination = async (req, res) => {
  try {
    const { patientId } = req.body;

    // Check if a profile exists for the given patientId
    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Create a new clinical examination record
    const clinicalExamination = await ClinicalExamination.create(req.body);

    // Link the new clinical examination record to the profile
    profile.clinicalExamination = clinicalExamination._id;
    await profile.save();

    res.status(201).json(clinicalExamination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClinicalExaminationByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const clinicalExamination = await ClinicalExamination.findOne({
      patientId,
    });
    if (!clinicalExamination) {
      return res
        .status(404)
        .json({ message: "Clinical examination not found" });
    }
    res.status(200).json(clinicalExamination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertClinicalExaminationByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = req.body;

    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const clinicalExamination = await ClinicalExamination.findOneAndUpdate(
      { patientId: patientId },
      { ...data, patientId: patientId },
      { new: true, upsert: true, runValidators: true }
    );

    if (!profile.clinicalExamination) {
      profile.clinicalExamination = clinicalExamination._id;
      await profile.save();
    }

    res.status(200).json(clinicalExamination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
