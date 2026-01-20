// src/utils/pricingCalculator.js

export const calculateOpticalPrice = (
  basePrice,
  options,
  selections,
  prescription
) => {
  let finalPrice = basePrice || 0;

  // 1. Material Cost
  const material = options?.materials?.find(
    (m) => m.name === selections.lensMaterial
  );
  if (material) finalPrice += material.priceMod;

  // 2. Design Cost
  const design = options?.designs?.find(
    (d) => d.name === selections.lensDesign
  );
  if (design) finalPrice += design.priceMod;

  // 3. Lens Type Cost
  const type = options?.lensTypes?.find((t) => t.name === selections.lensType);
  if (type) finalPrice += type.priceMod;

  // 4. Coatings/Add-ons Cost
  if (selections.coatings && Array.isArray(selections.coatings)) {
    selections.coatings.forEach((coatingName) => {
      const coating = options?.coatings?.find((c) => c.name === coatingName);
      if (coating) finalPrice += coating.priceMod;
    });
  }

  // 5. Grade Logic (Surcharges for high grades)
  if (options && prescription) {
    const { rightEye, leftEye } = prescription;

    const checkHighGrade = (eye) => {
      let surcharge = 0;
      // Check Sphere
      if (
        eye.sph &&
        Math.abs(parseFloat(eye.sph)) >= (options.highGradeThreshold || 4.0)
      ) {
        surcharge += options.highGradeSurcharge || 0;
      }
      // Check Cylinder
      if (
        eye.cyl &&
        Math.abs(parseFloat(eye.cyl)) >= (options.highCylThreshold || 2.0)
      ) {
        surcharge += options.highCylSurcharge || 0;
      }
      return surcharge;
    };

    // Apply surcharge once per pair? or per lens? Usually per pair in this context.
    // We check max surcharge between two eyes or sum them. Let's sum them if specific eyes are high grade.
    const odSurcharge = checkHighGrade(rightEye || {});
    const osSurcharge = checkHighGrade(leftEye || {});

    finalPrice += Math.max(odSurcharge, osSurcharge); // Or sum them depending on business rule
  }

  return finalPrice;
};
