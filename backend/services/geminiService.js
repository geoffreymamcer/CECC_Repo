import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeColorVisionWithGemini(testResults) {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze these color vision test results and provide a detailed assessment:
      - Overall Score: ${testResults.overallScore}%
      - Normal Vision Matches: ${testResults.normalVisionCount}/${testResults.totalQuestions}
      - Protanopia Matches: ${testResults.protanopiaCount}
      - Deuteranopia Matches: ${testResults.deuteranopiaCount}
      - Total Color Blindness Matches: ${testResults.totalColorBlindnessCount}

      Please provide:
      1. A detailed analysis of the results
      2. Specific recommendations based on the findings
      3. Suggested lifestyle adjustments if needed
      4. Whether professional consultation is recommended
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze results with AI");
  }
}

export { analyzeColorVisionWithGemini };
