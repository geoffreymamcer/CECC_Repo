// controllers/PlanOfManagementController.js
import PlanOfManagement from "../models/PlanOfManagement.js";
import Profile from "../models/Profile.js";

export const createPlanOfManagement = async (req, res) => {
  try {
    const { patientId } = req.body;

    const profile = await Profile.findById(patientId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const plan = await PlanOfManagement.create(req.body);

    profile.planOfManagement = plan._id;
    await profile.save();

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanOfManagementByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const plan = await PlanOfManagement.findOne({ patientId });
    if (!plan) {
      return res
        .status(404)
        .json({ message: "Plan of Management not found for this patient" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
