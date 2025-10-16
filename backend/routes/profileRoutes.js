import express from "express";
import {
  getAllProfiles,
  getProfileById,
  getProfileByPatientId,
  createProfile,
  updateProfile,
  getMyProfile,
  deleteProfile,
  getProfileCount,
} from "../controllers/ProfileController.js";

const router = express.Router();
import { auth } from "../middleware/auth.js";

// Get profile for the logged-in user
router.get("/me", auth, getMyProfile);

// Get total number of profiles
router.get("/count", auth, getProfileCount);

// Get all profiles
router.get("/", getAllProfiles);

// Get profile by MongoDB _id
router.get("/id/:id", getProfileById);

// Get profile by patient ID (now using custom _id)
router.get("/:patientId", getProfileByPatientId);

// Create new profile
router.post("/", createProfile);

// Update profile by ID (works with both MongoDB ObjectId and custom ID)
router.put("/:id", updateProfile);

// Delete profile by ID (works with both MongoDB ObjectId and custom ID)
router.delete("/:id", deleteProfile);

export default router;
