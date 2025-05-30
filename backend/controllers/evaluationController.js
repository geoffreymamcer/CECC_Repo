const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createEvaluationPrompt } = require("../utils/createEvaluationPrompt");
const { ishiharaTestPlatesConsistent } = require("../constants/ishiharaPlates");

const evaluateAnswer = async (req, res) => {
  try {
    const { plateNumber, userAnswer } = req.body;

    if (!plateNumber || !userAnswer) {
      return res.status(400).json({
        status: "error",
        message: "Missing plateNumber or userAnswer",
      });
    }

    // Find the plate data
    const plateData = ishiharaTestPlatesConsistent.find(
      (plate) => plate.plateNumber === plateNumber
    );

    if (!plateData) {
      return res.status(404).json({
        status: "error",
        message: "Plate not found",
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create and send prompt
    const prompt = createEvaluationPrompt(userAnswer, plateData);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const classification = response.text().trim();

    // Log for debugging
    console.log(`Plate ${plateNumber} evaluation:`, {
      userAnswer,
      classification,
    });

    return res.json({
      status: "success",
      data: {
        classification,
        plateNumber,
      },
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to evaluate answer",
    });
  }
};

module.exports = {
  evaluateAnswer,
};
