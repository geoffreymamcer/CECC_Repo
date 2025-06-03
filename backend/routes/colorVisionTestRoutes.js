import express from "express";
import { 
  createColorVisionTest, 
  getPatientColorVisionTests, 
  getColorVisionTest 
} from "../controllers/colorVisionTestController.js";
import { auth as protect } from "../middleware/auth.js";

const router = express.Router();

// Routes for color vision tests
router.route("/")
  .post(protect, createColorVisionTest)
  .get(protect, getPatientColorVisionTests);

router.route("/:id")
  .get(protect, getColorVisionTest);

export default router;
