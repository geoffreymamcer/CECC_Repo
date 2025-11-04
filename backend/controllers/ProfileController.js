import Profile from "../models/Profile.js";
import Visit from "../models/Visit.js";
import CaseHistory from "../models/CaseHistory.js";
import ClinicalExamination from "../models/ClinicalExamination.js";
import BasicBinocularVisionTests from "../models/BasicBinocularVisionTests.js";
import SlitLampFunduscopy from "../models/SlitLampFunduscopy.js";
import DiagnosticAssessmentPlan from "../models/DiagnosticAssessmentPlan.js";
import PlanOfManagement from "../models/PlanOfManagement.js";

export const getProfileCount = async (req, res) => {
  try {
    const count = await Profile.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    // 1. Fetch all patient profiles. Using .lean() for better performance.
    const profiles = await Profile.find().sort({ createdAt: -1 }).lean();

    // 2. For each profile, find its most recent visit in parallel for efficiency.
    const profilesWithVisitData = await Promise.all(
      profiles.map(async (profile) => {
        // Find the single most recent visit for the patientId, sorted by visitDate.
        const latestVisit = await Visit.findOne({
          // Use profile._id which is the ref to User and used as patientId in Visit
          patientId: profile._id,
        })
          .sort({ visitDate: -1 }) // Sorts to get the most recent visit first
          .lean();

        // 3. Attach the latest visit data to the profile object.
        if (latestVisit) {
          return {
            ...profile,
            // Format the date nicely and provide the diagnosis.
            lastVisit: new Date(latestVisit.visitDate).toLocaleDateString(),
            latestDiagnosis: latestVisit.diagnosis || "No diagnosis recorded",
          };
        } else {
          // If the patient has no visit history, return default values.
          return {
            ...profile,
            lastVisit: "N/A",
            latestDiagnosis: "No visit history",
          };
        }
      })
    );

    res.status(200).json(profilesWithVisitData);
  } catch (error) {
    console.error("Error fetching profiles with visit data:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching patient profiles",
    });
  }
};

// Get a single profile by ID
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile by patient ID - now using _id directly
export const getProfileByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    // Since we're now using the custom ID format as the _id field
    const profile = await Profile.findById(patientId);

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching profile",
    });
  }
};

// Create new profile
export const createProfile = async (req, res) => {
  try {
    const {
      _id,
      caseHistory,
      clinicalExamination,
      basicBinocularVisionTests,
      slitLampFunduscopy,
      diagnosticAssessmentPlan,
      planOfManagement,
      ...profileData
    } = req.body;

    const existingProfile = await Profile.findById(_id);
    if (existingProfile) {
      return res.status(400).json({
        status: "error",
        message: "Profile already exists for this ID",
      });
    }

    if (!profileData.patientId && _id) {
      profileData.patientId = _id;
    }

    const { region, province, city, barangay, street_subdivision } =
      profileData;
    if (region || province || city || barangay) {
      const combined = [barangay, city, province, region]
        .filter(Boolean)
        .join(", ");
      profileData.addressCombined = combined;
      profileData.address = street_subdivision
        ? `${street_subdivision}, ${combined}`
        : combined;
    }

    const profile = await Profile.create({ _id, ...profileData });

    if (caseHistory) {
      const newCaseHistory = await CaseHistory.create({
        ...caseHistory,
        patientId: profile._id,
      });
      profile.caseHistory = newCaseHistory._id;
    }

    // Create and link Clinical Examination if provided
    if (clinicalExamination) {
      const newClinicalExamination = await ClinicalExamination.create({
        ...clinicalExamination,
        patientId: profile._id,
      });
      profile.clinicalExamination = newClinicalExamination._id;
    }

    if (basicBinocularVisionTests) {
      const newBinocularTests = await BasicBinocularVisionTests.create({
        ...basicBinocularVisionTests,
        patientId: profile._id,
      });
      profile.basicBinocularVisionTests = newBinocularTests._id;
    }

    if (slitLampFunduscopy) {
      const newSlitLampFunduscopy = await SlitLampFunduscopy.create({
        ...slitLampFunduscopy,
        patientId: profile._id,
      });
      profile.slitLampFunduscopy = newSlitLampFunduscopy._id;
    }

    if (diagnosticAssessmentPlan) {
      const newDiagnosticPlan = await DiagnosticAssessmentPlan.create({
        ...diagnosticAssessmentPlan,
        patientId: profile._id,
      });
      profile.diagnosticAssessmentPlan = newDiagnosticPlan._id;
    }

    if (planOfManagement) {
      const newPlanOfManagement = await PlanOfManagement.create({
        ...planOfManagement,
        patientId: profile._id,
      });
      profile.planOfManagement = newPlanOfManagement._id;
    }

    await profile.save();

    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating profile",
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If separate address parts are present in the update, derive combined strings
    const { region, province, city, barangay, street_subdivision } = updateData;
    if (region || province || city || barangay) {
      const combined = [barangay, city, province, region]
        .filter(Boolean)
        .join(", ");
      updateData.addressCombined = combined;
      updateData.address = street_subdivision
        ? `${street_subdivision}, ${combined}`
        : combined;
    }

    // Handle profile picture update
    if (updateData.profilePicture) {
      // Validate base64 image
      if (!updateData.profilePicture.startsWith("data:image")) {
        return res.status(400).json({
          status: "error",
          message: "Invalid image format. Please upload a valid image.",
        });
      }
    }

    const profile = await Profile.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating profile",
    });
  }
};

// Delete a profile
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile for the logged-in user
export const getMyProfile = async (req, res) => {
  try {
    // The user ID is now directly the custom ID for patients
    const profile = await Profile.findOne({ patientId: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found for current user" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
