// controllers/PlanOfManagementController.js
import PlanOfManagement from "../models/PlanOfManagement.js";
// --- REMOVED --- The Profile model is no longer needed in this file.

// --- REMOVED --- The createPlanOfManagement function is obsolete.

// --- MODIFIED --- Fetches a single plan of management record by its own unique _id.
export const getPlanOfManagementByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const plan = await PlanOfManagement.findById(recordId);
    if (!plan) {
      return res
        .status(404)
        .json({ message: "Plan of Management record not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- MODIFIED --- Updates a single plan of management record by its own unique _id.
export const updatePlanOfManagementByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const data = req.body;

    const plan = await PlanOfManagement.findByIdAndUpdate(recordId, data, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res
        .status(404)
        .json({
          message: "Could not find Plan of Management record to update.",
        });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
