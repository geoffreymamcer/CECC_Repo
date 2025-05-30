const express = require("express");
const router = express.Router();
const {
  createPatient,
  getAllPatients,
} = require("../controllers/patientController");
const { auth, requireRole } = require("../middleware/auth");

// Explicitly require admin role
router.post("/create", auth, requireRole("admin"), createPatient);
router.get("/", auth, requireRole("admin"), getAllPatients);

module.exports = router;
