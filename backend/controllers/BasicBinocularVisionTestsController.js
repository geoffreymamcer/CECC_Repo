// controllers/BasicBinocularVisionTestsController.js
import BasicBinocularVisionTests from "../models/BasicBinocularVisionTests.js";

export const getBinocularTestsByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const tests = await BasicBinocularVisionTests.findById(recordId);
    if (!tests) {
      return res
        .status(404)
        .json({ message: "Basic binocular vision tests record not found" });
    }
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBinocularTestsByRecordId = async (req, res) => {
  try {
    const { recordId } = req.params;
    const data = req.body;

    const tests = await BasicBinocularVisionTests.findByIdAndUpdate(
      recordId,
      data,
      { new: true, runValidators: true }
    );

    if (!tests) {
      return res.status(404).json({
        message: "Could not find binocular vision tests record to update.",
      });
    }

    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
