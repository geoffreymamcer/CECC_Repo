export function analyzeResults(answers, questions) {
  const results = {
    normalVisionCount: 0,
    protanopiaCount: 0,
    deuteranopiaCount: 0,
    totalColorBlindnessCount: 0,
    totalQuestions: questions.length,
    plateResults: [],
  };

  answers.forEach((answer, index) => {
    const question = questions[index];
    const userAnswer = answer?.value || null;

    // Store individual plate result
    const plateResult = {
      plateNumber: question.plateNumber,
      userAnswer: userAnswer,
      normalVisionAnswer: question.normalVisionAnswer,
      isCorrect: userAnswer === question.normalVisionAnswer,
    };

    // Count matches for each type
    if (userAnswer === question.normalVisionAnswer) {
      results.normalVisionCount++;
    } else if (userAnswer === question.protanopiaAnswer) {
      results.protanopiaCount++;
    } else if (userAnswer === question.deuteranopiaAnswer) {
      results.deuteranopiaCount++;
    } else if (userAnswer === question.totalColorBlindnessAnswer) {
      results.totalColorBlindnessCount++;
    }

    results.plateResults.push(plateResult);
  });

  results.visionStatus = determineVisionStatus(results);
  return results;
}

function determineVisionStatus(results) {
  const normalVisionPercentage =
    (results.normalVisionCount / results.totalQuestions) * 100;

  if (normalVisionPercentage >= 90) {
    return "Normal Color Vision";
  } else if (normalVisionPercentage >= 70) {
    if (results.protanopiaCount > results.deuteranopiaCount) {
      return "Mild Protanopia (Red-Blind)";
    } else if (results.deuteranopiaCount > results.protanopiaCount) {
      return "Mild Deuteranopia (Green-Blind)";
    }
    return "Mild Color Vision Deficiency";
  } else {
    if (results.totalColorBlindnessCount >= results.totalQuestions * 0.8) {
      return "Total Color Blindness";
    } else if (results.protanopiaCount > results.deuteranopiaCount) {
      return "Severe Protanopia (Red-Blind)";
    } else if (results.deuteranopiaCount > results.protanopiaCount) {
      return "Severe Deuteranopia (Green-Blind)";
    }
    return "Severe Color Vision Deficiency";
  }
}
