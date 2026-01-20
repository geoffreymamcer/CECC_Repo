import path from "path";
import { fileURLToPath } from "url";

// --- SETUP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIMARY_COLOR = "#7F0000";
const HEADER_COLOR = "#1A202C";
const TEXT_COLOR = "#4A5568";
const LABEL_COLOR = "#2D3748";
const BORDER_COLOR = "#EAEAEA";

// --- CONFIGURATION ---
const FALLBACK = "N/A";

// --- HELPER FUNCTIONS ---
function hasValue(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed !== "" && trimmed !== "N/A" && trimmed !== "undefined";
  }
  if (typeof val === "number") return true;
  if (typeof val === "boolean") return val;
  if (typeof val === "object" && !Array.isArray(val)) {
    return Object.values(val).some((v) => hasValue(v));
  }
  return false;
}

function formatBooleanData(dataObject) {
  if (!dataObject || typeof dataObject !== "object") return "";
  const trueKeys = Object.keys(dataObject).filter(
    (key) => key !== "others" && dataObject[key] === true
  );
  if (trueKeys.length === 0) return "";

  return trueKeys
    .map(
      (key) =>
        key.charAt(0).toUpperCase() +
        key
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim()
    )
    .join(", ");
}

function formatDate(dateString) {
  if (!hasValue(dateString)) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderInfoItem(label, value, fullWidth = false) {
  if (!hasValue(value)) return "";
  const className = fullWidth ? "info-item full-width" : "info-item";
  return `<div class="${className}"><span class="label">${label}:</span><span class="value">${value}</span></div>`;
}

// --- HTML TEMPLATE FOR PATIENT INFO ---
function generatePatientInformationHtml(patient) {
  const fullName = [patient.firstName, patient.middleName, patient.lastName]
    .filter(Boolean)
    .join(" ");

  const addressParts = [
    patient.street_subdivision,
    patient.barangay,
    patient.city,
    patient.province,
    patient.region,
  ].filter(hasValue);

  return `
    <div class="header-content">
        <div>
            <h1>Patient Information Report</h1>
            <p>Date of Report: ${formatDate(new Date())}</p>
        </div>
    </div>
    
    <div class="patient-identifier">
        <h2>${fullName}</h2>
        <p>Patient ID: ${patient.patientId || ""}</p>
    </div>

    <div class="section-header">Identity Details</div>
    <div class="grid-container">
        ${renderInfoItem("Date of Birth", formatDate(patient.dob))}
        ${renderInfoItem(
          "Age",
          patient.age ? `${patient.age} (${patient.ageCategory})` : ""
        )}
        ${renderInfoItem("Gender", patient.gender)}
        ${renderInfoItem("Civil Status", patient.civilStatus)}
        ${renderInfoItem("Occupation", patient.occupation, true)}
    </div>

    ${
      hasValue(patient.contact) ||
      hasValue(patient.email) ||
      hasValue(patient.referralBy)
        ? `<div class="section-header">Contact Information</div>
       <div class="grid-container">
          ${renderInfoItem(
            "Phone Number",
            patient.contact || patient.phone_number
          )}
          ${renderInfoItem("Email Address", patient.email)}
          ${renderInfoItem("Referred By", patient.referralBy, true)}
       </div>`
        : ""
    }
    
    ${
      addressParts.length > 0
        ? `<div class="section-header">Address Information</div>
       <div class="grid-container">
          ${renderInfoItem("Full Address", addressParts.join(", "), true)}
       </div>`
        : ""
    }
`;
}

// --- HTML TEMPLATE FOR CASE HISTORY ---
function generateCaseHistoryHtml(caseHistory) {
  if (!caseHistory || !hasValue(caseHistory)) return "";

  const renderSection = (title, contentFunc) => {
    const content = contentFunc();
    if (!content.trim()) return "";
    return `<div class="section-header">${title}</div>${content}`;
  };

  const getChiefComplaintContent = () => {
    const complaints = formatBooleanData(caseHistory.chiefComplaint);
    const others = caseHistory.chiefComplaint?.others;
    if (!complaints && !hasValue(others)) return "";

    let html = `<div class="complaint-grid">`;
    if (complaints)
      html += `<div class="info-item"><span class="label">Complaints:</span><span class="value">${complaints}</span></div>`;
    if (hasValue(others))
      html += `<div class="info-item"><span class="label">Others:</span><span class="value">${others}</span></div>`;
    html += `</div>`;

    const history = caseHistory.historyOfChiefComplaint || {};
    if (hasValue(history)) {
      html += `<div class="info-grid sub-section">`;
      html += renderInfoItem("Frequency", history.frequency);
      html += renderInfoItem("Onset", history.onset);
      html += renderInfoItem("Location", history.location);
      html += renderInfoItem("Duration", history.duration);
      html += renderInfoItem("Relief", history.relief);
      html += renderInfoItem("Quality", history.quality);
      html += `</div>`;
    }
    return html;
  };

  // 1️⃣ START MODIFICATION: Changed 'page-break' to 'major-section' to allow continuous scrolling
  let html = `<div class="major-section"><h1 class="page-title">Case History</h1>`;
  // 1️⃣ END MODIFICATION

  let hasContent = false;

  const sections = [
    { title: "Chief Complaint", fn: getChiefComplaintContent },
    {
      title: "Associated Complaint",
      fn: () => {
        const complaints = formatBooleanData(caseHistory.associatedComplaint);
        const others = caseHistory.associatedComplaint?.others;
        if (!complaints && !hasValue(others)) return "";
        let h = `<div class="complaint-grid">
            ${renderInfoItem("Complaints", complaints)}
            ${renderInfoItem("Others", others)}
         </div>`;
        const hist = caseHistory.historyOfAssociatedComplaint;
        if (hasValue(hist)) {
          h += `<div class="info-grid sub-section">
                ${renderInfoItem("Frequency", hist.frequency)}
                ${renderInfoItem("Onset", hist.onset)}
             </div>`;
        }
        return h;
      },
    },
    {
      title: "Medical & Family History",
      fn: () => {
        const pmh = formatBooleanData(caseHistory.medicalHistory);
        const pmhO = caseHistory.medicalHistory?.others;
        const fmh = formatBooleanData(caseHistory.familyHistory);
        const fmhO = caseHistory.familyHistory?.others;

        if (!pmh && !hasValue(pmhO) && !fmh && !hasValue(fmhO)) return "";

        return `<div class="complaint-grid">
            ${renderInfoItem("Patient Medical History", pmh)}
            ${renderInfoItem("Others", pmhO)}
            ${renderInfoItem("Family Medical History", fmh)}
            ${renderInfoItem("Others", fmhO)}
         </div>`;
      },
    },
    {
      title: "Ocular History",
      fn: () => {
        const h = caseHistory.ocularHistory;
        if (!hasValue(h)) return "";
        return `<div class="info-grid sub-section">
            ${renderInfoItem("Spectacle Rx", h.spectacleRx)}
            ${renderInfoItem("Spectacle Year", h.spectacleYear)}
            ${renderInfoItem("Contact Lens", h.contactLens)}
            ${renderInfoItem("Eye Surgery", h.eyeSurgery)}
            ${renderInfoItem("Systemic Surgery", h.systemicSurgery)}
        </div>`;
      },
    },
    {
      title: "Occupational & Digital",
      fn: () => {
        const occ = caseHistory.occupationalHistory;
        const dig = caseHistory.digitalHistory;
        if (!hasValue(occ) && !hasValue(dig)) return "";

        let out = `<div class="info-grid">`;
        if (occ) {
          if (occ.working) out += renderInfoItem("Is Working", "Yes");
          if (occ.student) out += renderInfoItem("Is Student", "Yes");
          out += renderInfoItem("Details", occ.details, true);
        }
        if (dig) {
          out += renderInfoItem("Cellphone", dig.cellphone);
          out += renderInfoItem("Laptop", dig.laptop);
          out += renderInfoItem("Desktop", dig.desktop);
        }
        out += `</div>`;
        return out;
      },
    },
  ];

  sections.forEach((s) => {
    const c = s.fn();
    if (c && c.indexOf("span") > -1) {
      html += `<div class="section-header">${s.title}</div>${c}`;
      hasContent = true;
    }
  });

  // Only return the HTML if there is actual content inside the section
  return hasContent ? html + "</div>" : "";
}

function generateEyeDataTableHtml(title, dataRows) {
  const validRows = dataRows.filter(
    (row) => hasValue(row.od) || hasValue(row.os)
  );

  if (validRows.length === 0) return "";

  const rowsHtml = validRows
    .map(
      (row) => `
        <div class="table-row">
            <span class="label">${row.label}</span>
            <span class="value">${row.od || "-"}</span>
            <span class="value">${row.os || "-"}</span>
        </div>
    `
    )
    .join("");

  return `
        <div class="sub-section">
            <h3>${title}</h3>
            <div class="eye-data-table">
                <div class="table-header">
                    <span class="label">Test</span>
                    <span class="value">OD (Right)</span>
                    <span class="value">OS (Left)</span>
                </div>
                ${rowsHtml}
            </div>
        </div>
    `;
}

function generateClinicalExaminationHtml(clinicalExam) {
  if (!clinicalExam || !hasValue(clinicalExam)) return "";

  // 1️⃣ START MODIFICATION: Use 'major-section' instead of 'page-break'
  let html = `<div class="major-section"><h1 class="page-title">Clinical Examination</h1>`;
  // 1️⃣ END MODIFICATION
  let hasContent = false;

  const va = clinicalExam.visualAcuity;
  if (hasValue(va)) {
    let vaContent = "";
    if (hasValue(va.chartUsed) || hasValue(va.testDistanceUsed)) {
      vaContent += `<div class="info-grid">
            ${renderInfoItem("Chart Used", va.chartUsed)}
            ${renderInfoItem("Test Distance", va.testDistanceUsed)}
         </div>`;
    }

    const without = [
      {
        label: "Unaided",
        od: va.withoutGlasses?.od?.sc,
        os: va.withoutGlasses?.os?.sc,
      },
      {
        label: "Pinhole",
        od: va.withoutGlasses?.od?.ph,
        os: va.withoutGlasses?.os?.ph,
      },
      {
        label: "Near",
        od: va.withoutGlasses?.od?.near,
        os: va.withoutGlasses?.os?.near,
      },
    ];
    vaContent += generateEyeDataTableHtml("Without Glasses", without);

    const withG = [
      {
        label: "Aided",
        od: va.withGlasses?.od?.sc,
        os: va.withGlasses?.os?.sc,
      },
      {
        label: "Pinhole",
        od: va.withGlasses?.od?.ph,
        os: va.withGlasses?.os?.ph,
      },
    ];
    vaContent += generateEyeDataTableHtml("With Glasses", withG);

    if (vaContent) {
      html += `<div class="section-header">Visual Acuity</div>${vaContent}`;
      hasContent = true;
    }
  }

  const arRows = [
    {
      label: "Sphere",
      od: clinicalExam.autorefractometer?.od?.sphere,
      os: clinicalExam.autorefractometer?.os?.sphere,
    },
    {
      label: "Cylinder",
      od: clinicalExam.autorefractometer?.od?.cylinder,
      os: clinicalExam.autorefractometer?.os?.cylinder,
    },
    {
      label: "Axis",
      od: clinicalExam.autorefractometer?.od?.axis,
      os: clinicalExam.autorefractometer?.os?.axis,
    },
  ];
  const arHtml = generateEyeDataTableHtml("Autorefractometer", arRows);
  if (arHtml) {
    html += `<div class="section-header">Objective Refraction</div>${arHtml}`;
    hasContent = true;
  }

  const manRows = [
    {
      label: "Sphere",
      od: clinicalExam.manifestRefraction?.od?.sphere,
      os: clinicalExam.manifestRefraction?.os?.sphere,
    },
    {
      label: "Cylinder",
      od: clinicalExam.manifestRefraction?.od?.cylinder,
      os: clinicalExam.manifestRefraction?.os?.cylinder,
    },
    {
      label: "Axis",
      od: clinicalExam.manifestRefraction?.od?.axis,
      os: clinicalExam.manifestRefraction?.os?.axis,
    },
    {
      label: "VA",
      od: clinicalExam.manifestRefraction?.od?.va,
      os: clinicalExam.manifestRefraction?.os?.va,
    },
    {
      label: "ADD",
      od: clinicalExam.manifestRefraction?.od?.add,
      os: clinicalExam.manifestRefraction?.os?.add,
    },
  ];
  const manHtml = generateEyeDataTableHtml("Manifest Refraction", manRows);
  if (manHtml) {
    html += `<div class="section-header">Subjective Refraction</div>${manHtml}`;
    hasContent = true;
  }

  if (hasValue(clinicalExam.medsUsed)) {
    html += `<div class="section-header">Additional</div>
      <div class="info-grid">
         ${renderInfoItem("Meds Type", clinicalExam.medsUsed.type)}
         ${renderInfoItem("Others", clinicalExam.medsUsed.comboTCOthers)}
      </div>`;
    hasContent = true;
  }

  return hasContent ? html + "</div>" : "";
}

function generateBinocularTestsHtml(binocularTests) {
  if (!hasValue(binocularTests)) return "";

  const bTests = binocularTests.binocularTests || {};
  let content = "";

  if (hasValue(bTests)) {
    content += `<div class="info-grid">`;
    Object.keys(bTests).forEach((key) => {
      if (key.includes("angleEst")) return;
      if (hasValue(bTests[key])) {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
        content += renderInfoItem(label, bTests[key]);
      }
    });
    content += `</div>`;
  }

  if (!content.includes("class=")) return "";

  // 1️⃣ START MODIFICATION: Use 'major-section' instead of 'page-break'
  return `
        <div class="major-section">
            <h1 class="page-title">Binocular Vision Tests</h1>
            <div class="section-header">Tests</div>
            ${content}
        </div>
    `;
  // 1️⃣ END MODIFICATION
}

function generateSlitLampFunduscopyHtml(slitLampData) {
  if (!hasValue(slitLampData)) return "";

  const slod = slitLampData.slitLamp?.od || {};
  const slos = slitLampData.slitLamp?.os || {};

  const keys = Object.keys(slod);
  const slitLampRows = keys.map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    od: slod[key],
    os: slos[key],
  }));

  const slHtml = generateEyeDataTableHtml(
    "Anterior Segment (Slit Lamp)",
    slitLampRows
  );

  const fdod = slitLampData.funduscopy?.od || {};
  const fdos = slitLampData.funduscopy?.os || {};
  const fKeys = Object.keys(fdod);
  const fundusRows = fKeys.map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    od: fdod[key],
    os: fdos[key],
  }));

  const fHtml = generateEyeDataTableHtml(
    "Posterior Segment (Funduscopy)",
    fundusRows
  );

  if (!slHtml && !fHtml) return "";

  // 1️⃣ START MODIFICATION: Use 'major-section' instead of 'page-break'
  return `
        <div class="major-section">
            <h1 class="page-title">Slit Lamp & Funduscopy</h1>
            ${
              slHtml
                ? `<div class="section-header">Slit Lamp</div>${slHtml}`
                : ""
            }
            ${
              fHtml
                ? `<div class="section-header">Funduscopy</div>${fHtml}`
                : ""
            }
        </div>
    `;
  // 1️⃣ END MODIFICATION
}

function drawChecklist(items) {
  if (!hasValue(items)) return "";

  const trueKeys = Object.keys(items).filter((k) => items[k] === true);
  if (trueKeys.length === 0) return "";

  const listHtml = trueKeys
    .map((key) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return `<div class="check-item"><span class="check-icon">✔</span> ${label}</div>`;
    })
    .join("");

  return `<div class="checklist-grid">${listHtml}</div>`;
}

function generateDiagnosticPlanHtml(diagnosticPlan) {
  if (!hasValue(diagnosticPlan)) return "";

  const checklist = drawChecklist(diagnosticPlan.diagnosticTests);
  const interpretation = hasValue(diagnosticPlan.interpretationOfResults)
    ? diagnosticPlan.interpretationOfResults
    : "";
  const assessment =
    hasValue(diagnosticPlan.assessment?.primaryImpression) ||
    hasValue(diagnosticPlan.assessment?.secondaryImpression);

  if (!checklist && !interpretation && !assessment) return "";

  // 1️⃣ START MODIFICATION: Use 'major-section' instead of 'page-break'
  return `
        <div class="major-section">
            <h1 class="page-title">Diagnostic & Assessment</h1>
            ${
              checklist
                ? `<div class="section-header">Tests Performed</div>${checklist}`
                : ""
            }
            ${
              interpretation
                ? `<div class="section-header">Results</div><div class="paragraph-block"><p>${interpretation}</p></div>`
                : ""
            }
            ${
              assessment
                ? `<div class="section-header">Assessment</div><div class="info-grid">
                ${renderInfoItem(
                  "Primary",
                  diagnosticPlan.assessment?.primaryImpression,
                  true
                )}
                ${renderInfoItem(
                  "Secondary",
                  diagnosticPlan.assessment?.secondaryImpression,
                  true
                )}
            </div>`
                : ""
            }
        </div>
    `;
  // 1️⃣ END MODIFICATION
}

function generatePlanOfManagementHtml(plan) {
  if (!plan || !hasValue(plan)) return "";

  // Check if there is ANY data in the plan before rendering the main header
  const hasSlitLamp =
    hasValue(plan.slitLampManagement?.od) ||
    hasValue(plan.slitLampManagement?.os);

  const optical = plan.opticalManagement;
  const hasOptical =
    hasValue(optical?.finalRx?.od?.sphere) ||
    hasValue(optical?.finalRx?.os?.sphere) ||
    hasValue(optical?.frames) ||
    hasValue(optical?.materials);

  const cl = plan.contactLensManagement;
  const hasCL =
    hasValue(cl?.finalRx?.od?.sphere) ||
    hasValue(cl?.finalRx?.os?.sphere) ||
    hasValue(cl?.brand);

  const hasSolutions =
    hasValue(plan.eyeCareSolutions?.lubricant) ||
    hasValue(plan.eyeCareSolutions?.contactLensSolutions);

  const hasTherapy =
    hasValue(plan.therapy?.amblyopia) || hasValue(plan.therapy?.others);

  const hasHygiene = Object.values(plan.ocularHygiene || {}).some(
    (v) => v === true
  );

  const hasReferral =
    hasValue(plan.referralAndFollowUp?.referralTo) ||
    hasValue(plan.referralAndFollowUp?.nextAppointment);

  // If absolutely no data in any subsection, return empty string
  if (
    !hasSlitLamp &&
    !hasOptical &&
    !hasCL &&
    !hasSolutions &&
    !hasTherapy &&
    !hasHygiene &&
    !hasReferral
  ) {
    return "";
  }

  // Start the Section
  let html = `<div class="major-section"><h1 class="page-title">Plan of Management</h1>`;

  // 1. Slit Lamp Management
  if (hasSlitLamp) {
    html += `
        <div class="section-header">Slit Lamp Management</div>
        <div class="info-grid">
            ${renderInfoItem("OD (Right)", plan.slitLampManagement?.od)}
            ${renderInfoItem("OS (Left)", plan.slitLampManagement?.os)}
        </div>`;
  }

  // 2. Optical Management
  if (hasOptical) {
    const opticalRxRows = [
      {
        label: "Sphere",
        od: optical.finalRx?.od?.sphere,
        os: optical.finalRx?.os?.sphere,
      },
      {
        label: "Cylinder",
        od: optical.finalRx?.od?.cylinder,
        os: optical.finalRx?.os?.cylinder,
      },
      {
        label: "Axis",
        od: optical.finalRx?.od?.axis,
        os: optical.finalRx?.os?.axis,
      },
      {
        label: "ADD",
        od: optical.finalRx?.od?.add,
        os: optical.finalRx?.os?.add,
      },
      {
        label: "Prism",
        od: optical.finalRx?.od?.prism,
        os: optical.finalRx?.os?.prism,
      },
      {
        label: "PD",
        od: optical.finalRx?.od?.ipd,
        os: optical.finalRx?.os?.ipd,
      },
    ];

    html += `<div class="section-header">Optical Management</div>`;
    html += generateEyeDataTableHtml(
      "Final Optical Prescription",
      opticalRxRows
    );

    // Optical Details Grid
    let detailsHtml = "";
    detailsHtml += renderInfoItem("Materials", optical.materials);
    detailsHtml += renderInfoItem("Coating", optical.coating);
    detailsHtml += renderInfoItem("Tint", optical.tint);
    detailsHtml += renderInfoItem("Design", optical.design);
    detailsHtml += renderInfoItem("Frames", optical.frames, true); // Full width

    // Frame Measurements
    if (hasValue(optical.frameMeasurements)) {
      detailsHtml += renderInfoItem("Frame A", optical.frameMeasurements.a);
      detailsHtml += renderInfoItem("Frame B", optical.frameMeasurements.b);
      detailsHtml += renderInfoItem("Frame ED", optical.frameMeasurements.ed);
      detailsHtml += renderInfoItem("Frame DBL", optical.frameMeasurements.dbl);
    }
    detailsHtml += renderInfoItem(
      "Glazing Inst.",
      optical.glazingInstruction,
      true
    );

    if (detailsHtml) {
      html += `<div class="info-grid sub-section">${detailsHtml}</div>`;
    }
  }

  // 3. Contact Lens Management
  if (hasCL) {
    const clRxRows = [
      {
        label: "Sphere",
        od: cl.finalRx?.od?.sphere,
        os: cl.finalRx?.os?.sphere,
      },
      {
        label: "Cylinder",
        od: cl.finalRx?.od?.cylinder,
        os: cl.finalRx?.os?.cylinder,
      },
      {
        label: "Axis",
        od: cl.finalRx?.od?.axis,
        os: cl.finalRx?.os?.axis,
      },
      {
        label: "BC",
        od: cl.finalRx?.od?.bc,
        os: cl.finalRx?.os?.bc,
      },
      {
        label: "DIA",
        od: cl.finalRx?.od?.dia,
        os: cl.finalRx?.os?.dia,
      },
    ];

    html += `<div class="section-header">Contact Lens Management</div>`;
    html += generateEyeDataTableHtml("Final CL Prescription", clRxRows);

    let clDetails = "";
    clDetails += renderInfoItem("Design", cl.design);
    clDetails += renderInfoItem("Brand", cl.brand);
    clDetails += renderInfoItem("Others", cl.others, true);

    if (clDetails) {
      html += `<div class="info-grid sub-section">${clDetails}</div>`;
    }
  }

  // 4. Solutions & Therapy
  if (hasSolutions || hasTherapy) {
    html += `<div class="section-header">Eye Care & Therapy</div><div class="info-grid">`;

    // Solutions
    html += renderInfoItem("Lubricant", plan.eyeCareSolutions?.lubricant);
    html += renderInfoItem(
      "CL Solution",
      plan.eyeCareSolutions?.contactLensSolutions
    );
    html += renderInfoItem("Vitamins", plan.eyeCareSolutions?.eyeVitamins);
    html += renderInfoItem("Lid Wipes", plan.eyeCareSolutions?.lidWipes);
    html += renderInfoItem("Compress", plan.eyeCareSolutions?.warmColdCompress);

    // Therapy
    html += renderInfoItem("Amblyopia", plan.therapy?.amblyopia);

    // Patching Logic
    const patchR = plan.therapy?.patching?.patchREye;
    const patchL = plan.therapy?.patching?.patchLEye;
    if (patchR || patchL) {
      const patchingStr = [patchR ? "Right Eye" : "", patchL ? "Left Eye" : ""]
        .filter(Boolean)
        .join(" & ");
      html += renderInfoItem("Patching", patchingStr);
    }

    html += renderInfoItem("Duration", plan.therapy?.time);
    html += renderInfoItem("Others", plan.therapy?.others);
    html += `</div>`;
  }

  // 5. Ocular Hygiene
  if (hasHygiene) {
    html += `<div class="section-header">Ocular Hygiene</div>`;
    html += drawChecklist(plan.ocularHygiene);
  }

  // 6. Referral
  if (hasReferral) {
    html += `<div class="section-header">Referral & Follow-Up</div><div class="info-grid">`;
    html += renderInfoItem("Refer To", plan.referralAndFollowUp?.referralTo);
    html += renderInfoItem("Purpose", plan.referralAndFollowUp?.purpose);
    html += renderInfoItem(
      "Next Visit",
      plan.referralAndFollowUp?.nextAppointment,
      true
    );
    html += `</div>`;
  }

  return html + "</div>";
}

// --- MAIN HTML ASSEMBLY ---
export function getFullHtml(patient, visit, clinicInfo) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Patient Report</title>
            <style>
                :root { --primary-color: #7F0000; --header-color: #1A202C; --text-color: #4A5568; --label-color: #2D3748; --border-color: #EAEAEA; }
                html { -webkit-print-color-adjust: exact; }
                body { font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 50px; background: #fff; font-size: 10pt; color: var(--text-color); }
                
                .header, .footer { display: none; }
                
                /* 2️⃣ START MODIFICATION: Changed 'page-break' class logic to 'major-section' for spacing */
                /* Removed: .page-break { page-break-before: always; } */
                .major-section { margin-top: 40px; margin-bottom: 20px; page-break-inside: avoid; }
                /* 2️⃣ END MODIFICATION */
                
                h1, .page-title { font-size: 16pt; color: var(--header-color); margin-bottom: 15px; border-bottom: 2px solid var(--primary-color); padding-bottom: 5px; }
                h2 { font-size: 22pt; color: var(--header-color); margin: 0 0 5px 0; }
                p { margin: 0; }
                .header-content { display: flex; justify-content: space-between; align-items: flex-start; }
                .section-header { background-color: var(--primary-color); color: white; font-weight: bold; padding: 7px 15px; margin-top: 20px; margin-bottom: 15px; font-size: 12pt; border-radius: 3px; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 40px; padding-left: 15px; }
                .info-item { display: flex; justify-content: space-between; align-items: baseline; padding: 2px 0; }
                .info-item .label { font-weight: bold; color: var(--label-color); white-space: nowrap; margin-right: 10px; }
                .eye-data-table { display: grid; grid-template-columns: 2fr 1.5fr 1.5fr; gap: 5px 15px; padding: 0 15px; margin-bottom: 15px; }
                .eye-data-table .table-row .value { border-bottom: 1px solid #f3f3f3; }
                .checklist-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 0 15px; }
            </style>
        </head>
        <body>
            ${generatePatientInformationHtml(patient)}
            ${
              visit.caseHistory
                ? generateCaseHistoryHtml(visit.caseHistory)
                : ""
            }
            ${
              visit.clinicalExamination
                ? generateClinicalExaminationHtml(visit.clinicalExamination)
                : ""
            }
            ${
              visit.basicBinocularVisionTests
                ? generateBinocularTestsHtml(visit.basicBinocularVisionTests)
                : ""
            }
            ${
              visit.slitLampFunduscopy
                ? generateSlitLampFunduscopyHtml(visit.slitLampFunduscopy)
                : ""
            }
            ${
              visit.diagnosticAssessmentPlan
                ? generateDiagnosticPlanHtml(visit.diagnosticAssessmentPlan)
                : ""
            }
            ${
              visit.planOfManagement
                ? generatePlanOfManagementHtml(visit.planOfManagement)
                : ""
            }
        </body>
        </html>
    `;
}
