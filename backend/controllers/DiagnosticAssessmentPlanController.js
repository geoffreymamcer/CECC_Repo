// controllers/DiagnosticAssessmentPlanController.js
import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
import Profile from "../models/Profile.js";

// Create a new Diagnostic Assessment Plan
export const createDiagnosticAssessmentPlan = async (req, res) => {
  try {
    const { patientId } = req.body;

    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if a record for this patient already exists
    const existingPlan = await DiagnosticAssessmentPlan.findOne({ patientId });
    if (existingPlan) {
      return res
        .status(400)
        .json({ message: "Diagnostic plan already exists for this patient." });
    }

    const plan = await DiagnosticAssessmentPlan.create(req.body);

    // Link this new plan to the patient's profile
    profile.diagnosticAssessmentPlan = plan._id;
    await profile.save();

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Diagnostic Assessment Plan by Patient ID
export const getDiagnosticAssessmentPlanByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const plan = await DiagnosticAssessmentPlan.findOne({ patientId });

    if (!plan) {
      return res.status(404).json({
        message: "Diagnostic Assessment Plan not found for this patient.",
      });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertDiagnosticAssessmentPlanByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const data = req.body;

    // Check if a profile exists
    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Find and update or create a new record
    const plan = await DiagnosticAssessmentPlan.findOneAndUpdate(
      { patientId: patientId },
      { ...data, patientId: patientId },
      { new: true, upsert: true, runValidators: true }
    );

    // If the profile doesn't have a reference to the record, add it
    if (!profile.diagnosticAssessmentPlan) {
      profile.diagnosticAssessmentPlan = plan._id;
      await profile.save();
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
