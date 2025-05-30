import express from "express";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/ProfileController.js";

const router = express.Router();

// Get all profiles
router.get("/", getAllProfiles);

// Get a specific profile by ID
router.get("/:id", getProfileById);

// Create a new profile
router.post("/", createProfile);

// Update a profile
router.put("/:id", updateProfile);

// Delete a profile
router.delete("/:id", deleteProfile);

export default router;
