// controllers/SlitLampFunduscopyController.js
import SlitLampFunduscopy from "../models/SlitLampFunduscopy.js";
// --- REMOVED --- The Profile model is no longer needed in this file.

// --- REMOVED --- The createSlitLampFunduscopy function is obsolete.

// --- MODIFIED --- Fetches a single record by its own unique _id.
export const getSlitLampFunduscopyByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const examination = await SlitLampFunduscopy.findById(recordId);

    if (!examination) {
      return res
        .status(404)
        .json({ message: "Slit Lamp and Funduscopy record not found" });
    }

    res.status(200).json(examination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- MODIFIED --- Updates a single record by its own unique _id.
export const updateSlitLampFunduscopyByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const data = req.body;

    const examination = await SlitLampFunduscopy.findByIdAndUpdate(
      recordId,
      data,
      { new: true, runValidators: true }
    );

    if (!examination) {
      return res
        .status(404)
        .json({
          message: "Could not find Slit Lamp and Funduscopy record to update.",
        });
    }

    res.status(200).json(examination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
