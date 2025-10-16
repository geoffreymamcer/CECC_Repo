import Patient from "../models/Patient.js";

export const createPatient = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "fullName",
      "dob",
      "age",
      "gender",
      "address",
      "contact",
      "occupation",
      "chiefComplaint",
      "diagnosis",
      "treatmentPlan",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Format date of birth
    const formattedDob = new Date(req.body.dob);
    const patientData = {
      ...req.body,
      dob: formattedDob,
    };

    const patient = await Patient.create(patientData);
    res.status(201).json({
      success: true,
      message: "Patient record created successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);
    res.status(400).json({
      message: error.message || "Failed to create patient record",
      error: error,
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default { createPatient, getAllPatients };
