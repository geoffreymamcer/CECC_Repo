import Visit from "../models/Visit.js";
import Profile from "../models/Profile.js";

// Get all visits for a patient
export const getVisitsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const visits = await Visit.find({ patientId }).sort({ visitDate: -1 });

    res.status(200).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching visits",
    });
  }
};

// Get a single visit by ID
export const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);

    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }

    res.status(200).json(visit);
  } catch (error) {
    console.error("Error fetching visit:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching visit",
    });
  }
};

// Create a new visit
export const createVisit = async (req, res) => {
  try {
    const { patientId, appointmentId } = req.body;
    
    // Create the visit
    const visit = await Visit.create(req.body);
    
    // Update the profile to add this visit to the visits array
    if (visit._id) {
      await Profile.findOneAndUpdate(
        { patientId },
        { $push: { visits: visit._id } }
      );
    }
    
    res.status(201).json(visit);
  } catch (error) {
    console.error("Error creating visit:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating visit",
    });
  }
};

// Update a visit
export const updateVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const visit = await Visit.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }

    res.status(200).json(visit);
  } catch (error) {
    console.error("Error updating visit:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating visit",
    });
  }
};

// Delete a visit
export const deleteVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);
    
    if (!visit) {
      return res.status(404).json({
        status: "error",
        message: "Visit not found",
      });
    }
    
    // Remove the visit from the profile's visits array
    await Profile.findOneAndUpdate(
      { patientId: visit.patientId },
      { $pull: { visits: id } }
    );
    
    // Delete the visit
    await Visit.findByIdAndDelete(id);
    
    res.status(200).json({
      status: "success",
      message: "Visit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting visit:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error deleting visit",
    });
  }
};
