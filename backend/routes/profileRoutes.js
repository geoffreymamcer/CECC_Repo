import express from "express";
import {
  getAllProfiles,
  getProfileById,
  getProfileByPatientId,
  createProfile,
  updateProfile,
  getMyProfile,
  deleteProfile
} from "../controllers/profileController.js";

const router = express.Router();
import { auth } from "../middleware/auth.js";

// Get profile for the logged-in user
router.get("/me", auth, getMyProfile);

// Get all profiles
router.get("/", getAllProfiles);

// Get profile by MongoDB _id
router.get("/id/:id", getProfileById);

// Get profile by patient ID
router.get("/:patientId", getProfileByPatientId);

// Create new profile
router.post("/", createProfile);

// Update profile
router.put("/:patientId", updateProfile);

// Delete profile by MongoDB _id
router.delete("/id/:id", deleteProfile);

export default router;
