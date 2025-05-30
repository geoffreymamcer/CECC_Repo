export function getPlateType(plateNumber) {
  if (plateNumber === 1) return "Demonstration Plate";
  if ([2, 3, 4, 5, 6, 7].includes(plateNumber)) return "Transformation Plate";
  else if ([8, 9, 10, 11, 12, 13].includes(plateNumber))
    return "Vanishing Plate";
  else if ([14, 15].includes(plateNumber)) return "Hidden Digit Plate";
  else if ([16, 17].includes(plateNumber))
    return "Diagnostic Plate (for protan/deutan differentiation)";
  else if ([18, 19, 20, 21, 22, 23, 24].includes(plateNumber))
    return "Tracing Plate";
  else return "Unknown Plate Type";
}

export function createEvaluationPrompt(userInput, plateData) {
  const plateNumber = plateData.plateNumber;
  const plateType = getPlateType(plateNumber);

  // Prepare arrays for more dynamic prompt generation if needed,
  // though the direct property access is also fine given the specific data structure.
  let seesNothingKeywords = [
    "nothing",
    "nothing at all",
    "blank",
    "just dots",
    "a jumble",
    "can't see anything",
    "don't see anything",
    "no number",
    "no line",
    "can't make out a number",
    "only see dots",
    "unclear",
    "blurry",
    "random dots",
    "I see no image",
    "empty",
  ];

  // Add specific "nothing" answers from plateData if they exist and are strings
  if (
    typeof plateData.normalVisionAnswer === "string" &&
    String(plateData.normalVisionAnswer).toLowerCase().includes("nothing")
  ) {
    // No need to add 'Normal Vision: sees nothing' here, as the prompt directly uses plateData.normalVisionAnswer
    // But if normalVisionAnswer *is* "nothing", it implies a match for "SEES_NOTHING_MATCH" or "NORMAL_VISION_MATCH" if normal is nothing.
    // We ensure general nothing keywords are comprehensive.
  }
  if (
    typeof plateData.protanopiaAnswer === "string" &&
    String(plateData.protanopiaAnswer).toLowerCase().includes("nothing")
  ) {
    // Same logic as above for deficient answers
  }
  if (
    typeof plateData.deuteranopiaAnswer === "string" &&
    String(plateData.deuteranopiaAnswer).toLowerCase().includes("nothing")
  ) {
    // Same logic as above for deficient answers
  }
  if (
    typeof plateData.totalColorBlindnessAnswer === "string" &&
    (String(plateData.totalColorBlindnessAnswer)
      .toLowerCase()
      .includes("nothing") ||
      String(plateData.totalColorBlindnessAnswer)
        .toLowerCase()
        .includes("no_clear_line") ||
      String(plateData.totalColorBlindnessAnswer)
        .toLowerCase()
        .includes("neither"))
  ) {
    // Ensure that specific "nothing" answers for total color blindness are covered by the general keywords.
    // The LLM will implicitly handle these because "nothing" is in the keywords.
  }

  const prompt = `
    You are an AI assistant specialized in evaluating Ishihara color vision test results.
    The user is presented with Ishihara Plate ${plateNumber} (a ${plateType}) and describes what they see.
    Your task is to classify their response based on standard Ishihara test interpretations.

    User's input: "${userInput}"

    Expected interpretations for Ishihara Plate ${plateNumber}:
    - Normal Vision: ${plateData.normalVisionAnswer}
    - Protanopia (Red-blind): ${plateData.protanopiaAnswer}
    - Deuteranopia (Green-blind): ${plateData.deuteranopiaAnswer}
    - Total Color Blindness: ${plateData.totalColorBlindnessAnswer}
    ${
      plateData.protanomalyAnswer
        ? `- Protanomaly (Red-weak): ${plateData.protanomalyAnswer}`
        : ""
    }
    ${
      plateData.deuteranomalyAnswer
        ? `- Deuteranomaly (Green-weak): ${plateData.deuteranomalyAnswer}`
        : ""
    }
    ${
      plateData.colorVisionDeficiencyAnswer
        ? `- General Color Vision Deficiency: ${
            Array.isArray(plateData.colorVisionDeficiencyAnswer)
              ? plateData.colorVisionDeficiencyAnswer.join(", ")
              : plateData.colorVisionDeficiencyAnswer
          }`
        : ""
    }
    ${
      plateData.redGreenDeficiencyAnswer
        ? `- Red-Green Deficiency: ${plateData.redGreenDeficiencyAnswer}`
        : ""
    }

    Common phrases indicating seeing nothing or an unclear image (especially for vanishing or hidden plates): ${seesNothingKeywords.join(
      ", "
    )}.

    Provide your classification as one of these categories. **Only output the category string, with no additional text or explanation.**

    - "NORMAL_VISION_MATCH"
    - "PROTANOPIA_MATCH"
    - "DEUTERANOPIA_MATCH"
    - "PROTANOMALY_MATCH"
    - "DEUTERANOMALY_MATCH"
    - "TOTAL_COLOR_BLINDNESS_MATCH"
    - "SEES_NOTHING_MATCH"
    - "AMBIGUOUS_OR_UNEXPECTED"

    Classification:
    `;

  return prompt; // This line was missing!
}
