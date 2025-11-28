import PlanOfManagement from "../models/PlanOfManagement.js";
import User from "../models/User.js";
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

export const updatePlanOfManagementByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const data = req.body;

    const plan = await PlanOfManagement.findByIdAndUpdate(recordId, data, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Could not find Plan of Management record to update.",
      });
    }

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestPlanForPatient = async (req, res) => {
  try {
    const patientId = req.user.patientId || req.user.id || req.user._id;

    if (!patientId) {
      return res
        .status(400)
        .json({ message: "Patient ID not found in token." });
    }

    const latestPlan = await PlanOfManagement.findOne({ patientId })
      .sort({ createdAt: -1 })
      .populate("visitId");

    if (!latestPlan) {
      return res
        .status(404)
        .json({ message: "No prescription records found." });
    }

    res.status(200).json(latestPlan);
  } catch (error) {
    console.error("Error fetching latest plan:", error);
    res.status(500).json({ message: "Server error fetching prescription." });
  }
};
