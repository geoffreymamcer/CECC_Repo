import MedicalHistory from "../models/MedicalHistory.js";
import Profile from "../models/Profile.js";

// Get medical history by patient ID
export const getMedicalHistoryByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log(`Fetching medical history for patient ID: ${patientId}`);
    
    // Try to find the medical history using the patient ID directly
    let medicalHistory = await MedicalHistory.findOne({ patientId });
    
    // If not found, try to find by using the patientId as _id
    if (!medicalHistory) {
      console.log(`No medical history found with patientId field, trying alternative lookups`);
      
      // Try to find a profile with this ID to confirm it's a valid patient
      const profile = await Profile.findOne({
        $or: [
          { _id: patientId },
          { patientId: patientId }
        ]
      });
      
      if (profile) {
        console.log(`Found profile with ID: ${profile._id}, looking for medical history with this ID`);
        // Try to find medical history with the profile's ID
        medicalHistory = await MedicalHistory.findOne({
          $or: [
            { patientId: profile._id },
            { patientId: profile.patientId }
          ]
        });
      }
    }

    if (!medicalHistory) {
      console.log(`No medical history found for patient ID: ${patientId}`);
      return res.status(404).json({
        status: "error",
        message: "Medical history not found",
      });
    }
    
    console.log(`Found medical history for patient ID: ${patientId}`);
    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error("Error fetching medical history:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching medical history",
    });
  }
};

// Create new medical history
export const createMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.body;
    
    // Check for duplicate patientId
    const existingMedicalHistory = await MedicalHistory.findOne({ patientId });
    if (existingMedicalHistory) {
      return res.status(400).json({
        status: "error",
        message: "Medical history already exists for this patient",
      });
    }
    
    // Create medical history with the patientId
    const medicalHistory = await MedicalHistory.create(req.body);
    
    // Update the profile to reference this medical history
    const profile = await Profile.findById(patientId);
    if (profile) {
      profile.medicalHistoryId = medicalHistory._id;
      await profile.save();
    }
    
    res.status(201).json(medicalHistory);
  } catch (error) {
    console.error("Error creating medical history:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating medical history",
    });
  }
};

// Update medical history
export const updateMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const medicalHistory = await MedicalHistory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!medicalHistory) {
      return res.status(404).json({
        status: "error",
        message: "Medical history not found",
      });
    }

    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error("Error updating medical history:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating medical history",
    });
  }
};

// Update medical history by patient ID
export const updateMedicalHistoryByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = { ...req.body };

    // Find the profile directly using the ID
    const profile = await Profile.findById(patientId);
    
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    let medicalHistory = await MedicalHistory.findOne({ patientId });

    if (!medicalHistory) {
      // If no medical history exists, create one
      medicalHistory = await MedicalHistory.create({
        patientId,
        ...updateData
      });

      // Update the profile to reference this medical history
      profile.medicalHistoryId = medicalHistory._id;
      await profile.save();

      return res.status(201).json(medicalHistory);
    }

    // Update existing medical history
    medicalHistory = await MedicalHistory.findOneAndUpdate(
      { patientId },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error("Error updating medical history:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating medical history",
    });
  }
};

// Delete medical history
export const deleteMedicalHistory = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findByIdAndDelete(req.params.id);
    
    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }
    
    // Remove reference from profile
    await Profile.updateOne(
      { patientId: medicalHistory.patientId },
      { $unset: { medicalHistoryId: "" } }
    );
    
    res.status(200).json({ message: "Medical history deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
