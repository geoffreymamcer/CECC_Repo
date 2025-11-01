// controllers/DiagnosticAssessmentPlanController.js
import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
// --- REMOVED --- The Profile model is no longer needed in this file.

// --- REMOVED --- The createDiagnosticAssessmentPlan function is obsolete.

// --- MODIFIED --- Fetches a single diagnostic plan record by its own unique _id.
export const getDiagnosticPlanByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const plan = await DiagnosticAssessmentPlan.findById(recordId);

    if (!plan) {
      return res.status(404).json({
        message: "Diagnostic Assessment Plan record not found.",
      });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- MODIFIED --- Updates a single diagnostic plan record by its own unique _id.
export const updateDiagnosticPlanByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const data = req.body;

    const plan = await DiagnosticAssessmentPlan.findByIdAndUpdate(
      recordId,
      data,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res
        .status(404)
        .json({
          message:
            "Could not find Diagnostic Assessment Plan record to update.",
        });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
