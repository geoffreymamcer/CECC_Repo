// controllers/ClinicalExaminationController.js
import ClinicalExamination from "../models/ClinicalExamination.js";
// --- REMOVED --- The Profile model is no longer needed for these operations.

// --- REMOVED --- createClinicalExamination is obsolete and has been deleted.

// --- MODIFIED --- Fetches a single clinical examination record by its own unique _id.
export const getClinicalExaminationByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const clinicalExamination = await ClinicalExamination.findById(recordId); // Find by its own ID
    if (!clinicalExamination) {
      return res
        .status(404)
        .json({ message: "Clinical examination record not found" });
    }
    res.status(200).json(clinicalExamination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- MODIFIED --- Updates a single clinical examination record by its own unique _id.
export const updateClinicalExaminationByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const data = req.body;

    const clinicalExamination = await ClinicalExamination.findByIdAndUpdate(
      recordId, // Find by its own ID
      data,
      { new: true, runValidators: true }
    );

    if (!clinicalExamination) {
      return res
        .status(404)
        .json({
          message: "Could not find Clinical Examination record to update.",
        });
    }

    res.status(200).json(clinicalExamination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
