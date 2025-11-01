// controllers/CaseHistoryController.js
import CaseHistory from "../models/CaseHistory.js";

// --- MODIFIED --- Renamed function and updated logic
export const getCaseHistoryByRecordId = async (req, res) => {
  try {
    // Use 'recordId' to match the route parameter
    const { recordId } = req.params;
    // Use the more direct and efficient findById method
    const caseHistory = await CaseHistory.findById(recordId);
    if (!caseHistory) {
      return res.status(404).json({ message: "Case history record not found" });
    }
    res.status(200).json(caseHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- MODIFIED --- Renamed function and updated logic
export const updateCaseHistoryByRecordId = async (req, res) => {
  try {
    // Use 'recordId' to match the route parameter
    const { recordId } = req.params;
    const data = req.body;

    // Use findByIdAndUpdate, which is the correct method for updating by _id
    const caseHistory = await CaseHistory.findByIdAndUpdate(recordId, data, {
      new: true,
      runValidators: true,
    });

    if (!caseHistory) {
      return res.status(404).json({
        message: "Could not find a case history record to update.",
      });
    }

    res.status(200).json(caseHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
