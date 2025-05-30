function createEvaluationPrompt(userAnswer, plateData) {
  const prompt = `You are evaluating an Ishihara color vision test response.
Please analyze if the user's answer matches any of the expected responses.

Test Details:
- Plate Number: ${plateData.plateNumber}
- Question: ${plateData.question}
- User's Answer: "${userAnswer}"

Expected Answers:
1. Normal Vision: "${plateData.normalVisionAnswer}"
2. Protanopia: "${plateData.protanopiaAnswer}"
3. Deuteranopia: "${plateData.deuteranopiaAnswer}"
${
  plateData.protanomalyAnswer
    ? `4. Protanomaly: "${plateData.protanomalyAnswer}"\n`
    : ""
}
${
  plateData.deuteranomalyAnswer
    ? `5. Deuteranomaly: "${plateData.deuteranomalyAnswer}"\n`
    : ""
}
6. Total Color Blindness: "${plateData.totalColorBlindnessAnswer}"

Based on similarity and meaning, classify the user's answer as ONE of these categories:
- NORMAL_VISION_MATCH
- PROTANOPIA_MATCH
- DEUTERANOPIA_MATCH
- PROTANOMALY_MATCH
- DEUTERANOMALY_MATCH
- TOTAL_COLOR_BLINDNESS_MATCH
- UNCLEAR_RESPONSE

Output only the classification category, nothing else.`;

  return prompt;
}

module.exports = {
  createEvaluationPrompt,
};
