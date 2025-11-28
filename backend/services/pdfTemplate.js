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
// Change this string to modify what appears for empty fields globally
const FALLBACK = "N/A";

// --- HELPER FUNCTIONS ---
function formatBooleanData(dataObject) {
  if (!dataObject || typeof dataObject !== "object") return FALLBACK;
  const trueKeys = Object.keys(dataObject).filter(
    (key) => key !== "others" && dataObject[key] === true
  );
  const formattedKeys = trueKeys
    .map(
      (key) =>
        key.charAt(0).toUpperCase() +
        key
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim()
    )
    .join(", ");
  return formattedKeys.length > 0 ? formattedKeys : FALLBACK;
}

function formatDate(dateString) {
  if (!dateString) return FALLBACK;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- HTML TEMPLATE FOR PATIENT INFO ---
function generatePatientInformationHtml(patient) {
  const fullName = [patient.firstName, patient.middleName, patient.lastName]
    .filter(Boolean)
    .join(" ");

  // Logic to handle address: if parts are missing, we still try to join,
  // but if the result is empty string, we return FALLBACK
  const addressParts = [
    patient.street_subdivision,
    patient.barangay,
    patient.city,
    patient.province,
    patient.region,
  ].filter(Boolean);

  const fullAddress =
    addressParts.length > 0 ? addressParts.join(", ") : FALLBACK;

  return `
    <div class="header-content">
        <div>
            <h1>Patient Information Report</h1>
            <p>Date of Report: ${formatDate(new Date())}</p>
        </div>
        <div class="profile-placeholder">Profile Picture</div>
    </div>
    
    <div class="patient-identifier">
        <h2>${fullName}</h2>
        <p>Patient ID: ${patient.patientId || FALLBACK}</p>
    </div>

    <div class="section-header">Identity Details</div>
    <div class="grid-container">
        <div class="info-item"><span class="label">Date of Birth:</span><span class="value">${formatDate(
          patient.dob
        )}</span></div>
        <div class="info-item"><span class="label">Age:</span><span class="value">${
          patient.age ? `${patient.age} (${patient.ageCategory})` : FALLBACK
        }</span></div>
        <div class="info-item"><span class="label">Gender:</span><span class="value">${
          patient.gender || FALLBACK
        }</span></div>
        <div class="info-item"><span class="label">Civil Status:</span><span class="value">${
          patient.civilStatus || FALLBACK
        }</span></div>
        <div class="info-item full-width"><span class="label">Occupation:</span><span class="value">${
          patient.occupation || FALLBACK
        }</span></div>
    </div>

    <div class="section-header">Contact Information</div>
    <div class="grid-container">
        <div class="info-item"><span class="label">Phone Number:</span><span class="value">${
          patient.contact || patient.phone_number || FALLBACK
        }</span></div>
        <div class="info-item"><span class="label">Email Address:</span><span class="value">${
          patient.email || FALLBACK
        }</span></div>
        <div class="info-item full-width"><span class="label">Referred By:</span><span class="value">${
          patient.referralBy || FALLBACK
        }</span></div>
    </div>
    
    <div class="section-header">Address Information</div>
    <div class="grid-container">
        <div class="info-item"><span class="label">Street / Subdivision:</span><span class="value">${
          patient.street_subdivision || FALLBACK
        }</span></div>
        <div class="info-item"><span class="label">Barangay:</span><span class="value">${
          patient.barangay || FALLBACK
        }</span></div>
        <div class="info-item"><span class="label">City / Municipality:</span><span class="value">${
          patient.city || FALLBACK
        }</span></div>
        <div class="info-item"><span class="label">Province:</span><span class="value">${
          patient.province || FALLBACK
        }</span></div>
        <div class="info-item full-width"><span class="label">Region:</span><span class="value">${
          patient.region || FALLBACK
        }</span></div>
    </div>
`;
}

// --- HTML TEMPLATE FOR CASE HISTORY ---
function generateCaseHistoryHtml(caseHistory) {
  return `
        <div class="page-break"></div>
        <h1 class="page-title">Case History</h1>

        <div class="section-header">Chief Complaint</div>
        <div class="complaint-grid">
            <div class="info-item"><span class="label">Complaints:</span><span class="value">${formatBooleanData(
              caseHistory.chiefComplaint
            )}</span></div>
            <div class="info-item"><span class="label">Others:</span><span class="value">${
              caseHistory.chiefComplaint?.others || FALLBACK
            }</span></div>
        </div>
        <div class="info-grid sub-section">
            <div class="info-item"><span class="label">Frequency:</span><span class="value">${
              caseHistory.historyOfChiefComplaint?.frequency || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Onset:</span><span class="value">${
              caseHistory.historyOfChiefComplaint?.onset || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Location:</span><span class="value">${
              caseHistory.historyOfChiefComplaint?.location || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Duration:</span><span class="value">${
              caseHistory.historyOfChiefComplaint?.duration || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Relief:</span><span class="value">${
              caseHistory.historyOfChiefComplaint?.relief || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Quality:</span><span class="value">${
              caseHistory.historyOfChiefComplaint?.quality || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Associated Complaint</div>
        <div class="complaint-grid">
            <div class="info-item"><span class="label">Complaints:</span><span class="value">${formatBooleanData(
              caseHistory.associatedComplaint
            )}</span></div>
            <div class="info-item"><span class="label">Others:</span><span class="value">${
              caseHistory.associatedComplaint?.others || FALLBACK
            }</span></div>
        </div>
        <div class="info-grid sub-section">
            <div class="info-item"><span class="label">Frequency:</span><span class="value">${
              caseHistory.historyOfAssociatedComplaint?.frequency || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Onset:</span><span class="value">${
              caseHistory.historyOfAssociatedComplaint?.onset || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Medical & Family History</div>
        <div class="complaint-grid">
            <div class="info-item"><span class="label">Patient Medical History:</span><span class="value">${formatBooleanData(
              caseHistory.medicalHistory
            )}</span></div>
            <div class="info-item"><span class="label">Others:</span><span class="value">${
              caseHistory.medicalHistory?.others || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Family Medical History:</span><span class="value">${formatBooleanData(
              caseHistory.familyHistory
            )}</span></div>
            <div class="info-item"><span class="label">Others:</span><span class="value">${
              caseHistory.familyHistory?.others || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Ocular History & Conditions</div>
        <div class="complaint-grid">
            <div class="info-item"><span class="label">Patient Ocular Condition:</span><span class="value">${formatBooleanData(
              caseHistory.ocularCondition
            )}</span></div>
            <div class="info-item"><span class="label">Others:</span><span class="value">${
              caseHistory.ocularCondition?.others || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Family Ocular Condition:</span><span class="value">${formatBooleanData(
              caseHistory.familyOcularCondition
            )}</span></div>
            <div class="info-item"><span class="label">Others:</span><span class="value">${
              caseHistory.familyOcularCondition?.others || FALLBACK
            }</span></div>
        </div>
        <div class="info-grid sub-section">
             <div class="info-item"><span class="label">Spectacle Rx:</span><span class="value">${
               caseHistory.ocularHistory?.spectacleRx || FALLBACK
             }</span></div>
            <div class="info-item"><span class="label">Spectacle Year:</span><span class="value">${
              caseHistory.ocularHistory?.spectacleYear || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Contact Lens:</span><span class="value">${
              caseHistory.ocularHistory?.contactLens || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Eye Surgery:</span><span class="value">${
              caseHistory.ocularHistory?.eyeSurgery || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Systemic Surgery:</span><span class="value">${
              caseHistory.ocularHistory?.systemicSurgery || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Lifestyle, Usage & Eyeglass History</div>
        <div class="info-grid">
            <div class="info-item"><span class="label">Is Working:</span><span class="value">${
              caseHistory.occupationalHistory?.working ? "Yes" : "No"
            }</span></div>
            <div class="info-item"><span class="label">Is Student:</span><span class="value">${
              caseHistory.occupationalHistory?.student ? "Yes" : "No"
            }</span></div>
            <div class="info-item full-width"><span class="label">Occupation Details:</span><span class="value">${
              caseHistory.occupationalHistory?.details || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Cellphone Use:</span><span class="value">${
              caseHistory.digitalHistory?.cellphone || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Laptop Use:</span><span class="value">${
              caseHistory.digitalHistory?.laptop || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Desktop Use:</span><span class="value">${
              caseHistory.digitalHistory?.desktop || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Television Use:</span><span class="value">${
              caseHistory.digitalHistory?.television || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Previous Power:</span><span class="value">${
              caseHistory.eyeglassHistory?.power || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Previous Lens Type:</span><span class="value">${
              caseHistory.eyeglassHistory?.lensType || FALLBACK
            }</span></div>
        </div>
    `;
}

function generateEyeDataTableHtml(title, dataRows) {
  // Generate the HTML for each row
  const rowsHtml = dataRows
    .map(
      (row) => `
        <div class="table-row">
            <span class="label">${row.label}</span>
            <span class="value">${row.od || FALLBACK}</span>
            <span class="value">${row.os || FALLBACK}</span>
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
                    <span class="value">OD (Right Eye)</span>
                    <span class="value">OS (Left Eye)</span>
                </div>
                ${rowsHtml}
            </div>
        </div>
    `;
}

function generateClinicalExaminationHtml(clinicalExam) {
  if (!clinicalExam) return "";

  const withoutGlassesRows = [
    {
      label: "Unaided (SC)",
      od: clinicalExam.visualAcuity?.withoutGlasses?.od?.sc,
      os: clinicalExam.visualAcuity?.withoutGlasses?.os?.sc,
    },
    {
      label: "Pinhole (PH)",
      od: clinicalExam.visualAcuity?.withoutGlasses?.od?.ph,
      os: clinicalExam.visualAcuity?.withoutGlasses?.os?.ph,
    },
    {
      label: "Near",
      od: clinicalExam.visualAcuity?.withoutGlasses?.od?.near,
      os: clinicalExam.visualAcuity?.withoutGlasses?.os?.near,
    },
  ];
  const withGlassesRows = [
    {
      label: "Aided (SC)",
      od: clinicalExam.visualAcuity?.withGlasses?.od?.sc,
      os: clinicalExam.visualAcuity?.withGlasses?.os?.sc,
    },
    {
      label: "Pinhole (PH)",
      od: clinicalExam.visualAcuity?.withGlasses?.od?.ph,
      os: clinicalExam.visualAcuity?.withGlasses?.os?.ph,
    },
    {
      label: "Near",
      od: clinicalExam.visualAcuity?.withGlasses?.od?.near,
      os: clinicalExam.visualAcuity?.withGlasses?.os?.near,
    },
  ];
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
  const akRows = [
    {
      label: "K1",
      od: clinicalExam.autokeratometer?.od?.k1,
      os: clinicalExam.autokeratometer?.os?.k1,
    },
    {
      label: "K2",
      od: clinicalExam.autokeratometer?.od?.k2,
      os: clinicalExam.autokeratometer?.os?.k2,
    },
    {
      label: "Axis",
      od: clinicalExam.autokeratometer?.od?.axis,
      os: clinicalExam.autokeratometer?.os?.axis,
    },
  ];
  const pupilSizeRows = [
    {
      label: "MPD",
      od: clinicalExam.pdPupilSize?.od?.mpd,
      os: clinicalExam.pdPupilSize?.os?.mpd,
    },
    {
      label: "Pupil Size",
      od: clinicalExam.pdPupilSize?.od?.pupilSize,
      os: clinicalExam.pdPupilSize?.os?.pupilSize,
    },
    {
      label: "HVID",
      od: clinicalExam.pdPupilSize?.od?.hvid,
      os: clinicalExam.pdPupilSize?.os?.hvid,
    },
  ];
  const pupilExamRows = [
    {
      label: "RAPD",
      od: clinicalExam.pupilExamination?.od?.rapd,
      os: clinicalExam.pupilExamination?.os?.rapd,
    },
    {
      label: "Direct",
      od: clinicalExam.pupilExamination?.od?.direct,
      os: clinicalExam.pupilExamination?.os?.direct,
    },
    {
      label: "Consensual",
      od: clinicalExam.pupilExamination?.od?.consensual,
      os: clinicalExam.pupilExamination?.os?.consensual,
    },
    {
      label: "PERRLA",
      od: clinicalExam.pupilExamination?.od?.perrla,
      os: clinicalExam.pupilExamination?.os?.perrla,
    },
  ];
  const manifestRows = [
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
    {
      label: "NVA",
      od: clinicalExam.manifestRefraction?.od?.nva,
      os: clinicalExam.manifestRefraction?.os?.nva,
    },
  ];

  return `
        <div class="page-break"></div>
        <h1 class="page-title">Clinical Examination</h1>

        <div class="section-header">Visual Acuity</div>
        <div class="info-grid">
            <div class="info-item"><span class="label">Chart Used:</span><span class="value">${
              clinicalExam.visualAcuity?.chartUsed || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Test Distance:</span><span class="value">${
              clinicalExam.visualAcuity?.testDistanceUsed || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Other Distance:</span><span class="value">${
              clinicalExam.visualAcuity?.testDistanceOther || FALLBACK
            }</span></div>
        </div>
        ${generateEyeDataTableHtml("Without Glasses", withoutGlassesRows)}
        ${generateEyeDataTableHtml("With Present Glasses", withGlassesRows)}
        <div class="info-grid sub-section">
             <div class="info-item"><span class="label">Dominant Eye (Far):</span><span class="value">${
               clinicalExam.visualAcuity?.dominantEye?.far?.od ||
               clinicalExam.visualAcuity?.dominantEye?.far?.os ||
               FALLBACK
             }</span></div>
             <div class="info-item"><span class="label">Dominant Eye (Near):</span><span class="value">${
               clinicalExam.visualAcuity?.dominantEye?.near?.od ||
               clinicalExam.visualAcuity?.dominantEye?.near?.os ||
               FALLBACK
             }</span></div>
        </div>

        <div class="section-header">Objective Refraction</div>
        ${generateEyeDataTableHtml("Autorefractometer (AR)", arRows)}
        ${generateEyeDataTableHtml("Autokeratometer (AK)", akRows)}

        <div class="section-header">Pupil Assessment</div>
        ${generateEyeDataTableHtml("PD / Pupil Size", pupilSizeRows)}
        ${generateEyeDataTableHtml("Pupil Examination", pupilExamRows)}
        
        <div class="section-header">Subjective Refraction</div>
        ${generateEyeDataTableHtml("Manifest Refraction", manifestRows)}
        
        <div class="section-header">Additional Results & Medications</div>
        <div class="info-grid">
            <div class="info-item full-width"><span class="label">ARK Results:</span><span class="value">${
              clinicalExam.arkResults || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Meds Used (Type):</span><span class="value">${
              clinicalExam.medsUsed?.type || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Meds Used (Other):</span><span class="value">${
              clinicalExam.medsUsed?.comboTCOthers || FALLBACK
            }</span></div>
        </div>
    `;
}

function generateBinocularTestsHtml(binocularTests) {
  if (!binocularTests) return "";

  const monocularNpaRows = [
    {
      label: "NPA",
      od: binocularTests.monocularTests?.npa?.od,
      os: binocularTests.monocularTests?.npa?.os,
    },
  ];
  const monocularDuctionRows = [
    {
      label: "Duction",
      od: binocularTests.monocularTests?.ocularMotilityDuction?.od,
      os: binocularTests.monocularTests?.ocularMotilityDuction?.os,
    },
  ];

  return `
        <div class="page-break"></div>
        <h1 class="page-title">Binocular Vision Tests</h1>

        <div class="section-header">Binocular Tests</div>
        <div class="info-grid">
            <div class="info-item"><span class="label">Stereo Acuity (Langs):</span><span class="value">${
              binocularTests.binocularTests?.stereoAcuityLangs || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Stereo Acuity (Circles):</span><span class="value">${
              binocularTests.binocularTests?.stereoAcuityCircles || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Ocular Motility (Version):</span><span class="value">${
              binocularTests.binocularTests?.ocularMotilityVersion || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">NPC:</span><span class="value">${
              binocularTests.binocularTests?.npc || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Worth 4 Light (6m):</span><span class="value">${
              binocularTests.binocularTests?.w4l6m || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Worth 4 Light (33cm):</span><span class="value">${
              binocularTests.binocularTests?.w4l33cm || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Maddox Wing:</span><span class="value">${
              binocularTests.binocularTests?.maddoxWing || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Cover Test (6m):</span><span class="value">${
              binocularTests.binocularTests?.ct6m || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Cover Test (33cm):</span><span class="value">${
              binocularTests.binocularTests?.ct33cm || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Bagolini (6m):</span><span class="value">${
              binocularTests.binocularTests?.bagolini6m || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Bagolini (33cm):</span><span class="value">${
              binocularTests.binocularTests?.bagolini33cm || FALLBACK
            }</span></div>
            <div class="info-item full-width"><span class="label">Other Tests:</span><span class="value">${
              binocularTests.binocularTests?.otherTests || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Angle Estimation</div>
        <div class="info-grid sub-section">
            <div class="info-item full-width section-title"><span class="label">@ 6 meters</span></div>
            <div class="info-item"><span class="label">Hirschberg's:</span><span class="value">${
              binocularTests.binocularTests?.angleEst6m?.hirschbergs || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Krimsky:</span><span class="value">${
              binocularTests.binocularTests?.angleEst6m?.krimsky || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">PCT:</span><span class="value">${
              binocularTests.binocularTests?.angleEst6m?.pct || FALLBACK
            }</span></div>
        </div>
        <div class="info-grid sub-section">
            <div class="info-item full-width section-title"><span class="label">@ 33 centimeters</span></div>
            <div class="info-item"><span class="label">Hirschberg's:</span><span class="value">${
              binocularTests.binocularTests?.angleEst33cm?.hirschbergs ||
              FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Krimsky:</span><span class="value">${
              binocularTests.binocularTests?.angleEst33cm?.krimsky || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">PCT:</span><span class="value">${
              binocularTests.binocularTests?.angleEst33cm?.pct || FALLBACK
            }</span></div>
        </div>
        
        <div class="section-header">Monocular Tests</div>
        ${generateEyeDataTableHtml(
          "Near Point of Accommodation",
          monocularNpaRows
        )}
        ${generateEyeDataTableHtml("Ocular Motility", monocularDuctionRows)}
    `;
}

function generateSlitLampFunduscopyHtml(slitLampData) {
  if (!slitLampData) return "";

  const slitLampRows = [
    {
      label: "Lids & Lashes",
      od: slitLampData.slitLamp?.od?.lidsLashes,
      os: slitLampData.slitLamp?.os?.lidsLashes,
    },
    {
      label: "Conjunctiva",
      od: slitLampData.slitLamp?.od?.conjunctiva,
      os: slitLampData.slitLamp?.os?.conjunctiva,
    },
    {
      label: "Sclera",
      od: slitLampData.slitLamp?.od?.sclera,
      os: slitLampData.slitLamp?.os?.sclera,
    },
    {
      label: "Cornea",
      od: slitLampData.slitLamp?.od?.cornea,
      os: slitLampData.slitLamp?.os?.cornea,
    },
    {
      label: "Anterior Chamber (AC)",
      od: slitLampData.slitLamp?.od?.ac,
      os: slitLampData.slitLamp?.os?.ac,
    },
    {
      label: "Iris",
      od: slitLampData.slitLamp?.od?.iris,
      os: slitLampData.slitLamp?.os?.iris,
    },
    {
      label: "Pupil",
      od: slitLampData.slitLamp?.od?.pupil,
      os: slitLampData.slitLamp?.os?.pupil,
    },
    {
      label: "Lens",
      od: slitLampData.slitLamp?.od?.lens,
      os: slitLampData.slitLamp?.os?.lens,
    },
    {
      label: "IOP",
      od: slitLampData.slitLamp?.od?.iop,
      os: slitLampData.slitLamp?.os?.iop,
    },
    {
      label: "IOP Type",
      od: slitLampData.slitLamp?.od?.iopType,
      os: slitLampData.slitLamp?.os?.iopType,
    },
    {
      label: "IOP Time",
      od: slitLampData.slitLamp?.od?.iopTime,
      os: slitLampData.slitLamp?.os?.iopTime,
    },
  ];

  const funduscopyRows = [
    {
      label: "Retina",
      od: slitLampData.funduscopy?.od?.retina,
      os: slitLampData.funduscopy?.os?.retina,
    },
    {
      label: "Macula",
      od: slitLampData.funduscopy?.od?.macula,
      os: slitLampData.funduscopy?.os?.macula,
    },
    {
      label: "Vessels",
      od: slitLampData.funduscopy?.od?.vessels,
      os: slitLampData.funduscopy?.os?.vessels,
    },
    {
      label: "AVR (A/V Ratio)",
      od: slitLampData.funduscopy?.od?.avr,
      os: slitLampData.funduscopy?.os?.avr,
    },
    {
      label: "Optic Disc",
      od: slitLampData.funduscopy?.od?.opticDisc,
      os: slitLampData.funduscopy?.os?.opticDisc,
    },
    {
      label: "CDR (Cup/Disc Ratio)",
      od: slitLampData.funduscopy?.od?.cdr,
      os: slitLampData.funduscopy?.os?.cdr,
    },
    {
      label: "Others",
      od: slitLampData.funduscopy?.od?.others,
      os: slitLampData.funduscopy?.os?.others,
    },
  ];

  return `
        <div class="page-break"></div>
        <h1 class="page-title">Slit Lamp & Funduscopy</h1>

        <div class="section-header">Slit Lamp Examination (Anterior Segment)</div>
        ${generateEyeDataTableHtml("Anterior Segment Findings", slitLampRows)}

        <div class="section-header">Funduscopy (Posterior Segment)</div>
        ${generateEyeDataTableHtml(
          "Posterior Segment Findings",
          funduscopyRows
        )}
    `;
}

function drawChecklist(items) {
  if (!items || typeof items !== "object") return "";
  const listHtml = Object.keys(items)
    .map((key) => {
      const label =
        key.charAt(0).toUpperCase() +
        key
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim();
      const icon = items[key]
        ? '<span class="check-icon">✔</span>'
        : '<span class="cross-icon">✖</span>';
      return `<div class="check-item">${icon} ${label}</div>`;
    })
    .join("");

  return `<div class="checklist-grid">${listHtml}</div>`;
}

function generateDiagnosticPlanHtml(diagnosticPlan) {
  if (!diagnosticPlan) return "";

  let planManagementHtml = "";
  if (
    diagnosticPlan.planManagement &&
    diagnosticPlan.planManagement.length > 0
  ) {
    diagnosticPlan.planManagement.forEach((plan, index) => {
      if (!plan.od && !plan.os) return; // Skip if plan is empty
      const planRows = [
        {
          label: "Medication/Treatment:",
          od: plan.od?.meds,
          os: plan.os?.meds,
        },
        { label: "Quantity:", od: plan.od?.quantity, os: plan.os?.quantity },
        { label: "Frequency:", od: plan.od?.frequency, os: plan.os?.frequency },
        { label: "Duration:", od: plan.od?.duration, os: plan.os?.duration },
      ];
      planManagementHtml += generateEyeDataTableHtml(
        `Management Plan ${index + 1}`,
        planRows
      );
    });
  }

  return `
        <div class="page-break"></div>
        <h1 class="page-title">Diagnostic Tests & Assessment</h1>

        <div class="section-header">Diagnostic Tests Performed</div>
        ${drawChecklist(diagnosticPlan.diagnosticTests)}

        <div class="section-header">Interpretation of Results</div>
        <div class="paragraph-block">
            <p>${diagnosticPlan.interpretationOfResults || FALLBACK}</p>
        </div>

        <div class="section-header">Assessment</div>
        <div class="info-grid">
            <div class="info-item full-width">
                <span class="label">Primary Impression:</span>
                <span class="value">${
                  diagnosticPlan.assessment?.primaryImpression || FALLBACK
                }</span>
            </div>
            <div class="info-item full-width">
                <span class="label">Secondary Impression:</span>
                <span class="value">${
                  diagnosticPlan.assessment?.secondaryImpression || FALLBACK
                }</span>
            </div>
        </div>

        <div class="section-header">Plan & Management</div>
        ${
          planManagementHtml ||
          '<p class="paragraph-block">No management plan specified.</p>'
        }
    `;
}

function generatePlanOfManagementHtml(plan) {
  if (!plan) return "";

  const opticalRxRows = [
    {
      label: "Sphere",
      od: plan.opticalManagement?.finalRx?.od?.sphere,
      os: plan.opticalManagement?.finalRx?.os?.sphere,
    },
    {
      label: "Cylinder",
      od: plan.opticalManagement?.finalRx?.od?.cylinder,
      os: plan.opticalManagement?.finalRx?.os?.cylinder,
    },
    {
      label: "Axis",
      od: plan.opticalManagement?.finalRx?.od?.axis,
      os: plan.opticalManagement?.finalRx?.os?.axis,
    },
    {
      label: "ADD",
      od: plan.opticalManagement?.finalRx?.od?.add,
      os: plan.opticalManagement?.finalRx?.os?.add,
    },
    {
      label: "Prism",
      od: plan.opticalManagement?.finalRx?.od?.prism,
      os: plan.opticalManagement?.finalRx?.os?.prism,
    },
    {
      label: "Base",
      od: plan.opticalManagement?.finalRx?.od?.base,
      os: plan.opticalManagement?.finalRx?.os?.base,
    },
    {
      label: "MRP",
      od: plan.opticalManagement?.finalRx?.od?.mrp,
      os: plan.opticalManagement?.finalRx?.os?.mrp,
    },
    {
      label: "IPD",
      od: plan.opticalManagement?.finalRx?.od?.ipd,
      os: plan.opticalManagement?.finalRx?.os?.ipd,
    },
    {
      label: "VH",
      od: plan.opticalManagement?.finalRx?.od?.vh,
      os: plan.opticalManagement?.finalRx?.os?.vh,
    },
    {
      label: "Panto",
      od: plan.opticalManagement?.finalRx?.od?.panto,
      os: plan.opticalManagement?.finalRx?.os?.panto,
    },
    {
      label: "Wrap",
      od: plan.opticalManagement?.finalRx?.od?.wrap,
      os: plan.opticalManagement?.finalRx?.os?.wrap,
    },
  ];

  const contactLensRxRows = [
    {
      label: "Sphere",
      od: plan.contactLensManagement?.finalRx?.od?.sphere,
      os: plan.contactLensManagement?.finalRx?.os?.sphere,
    },
    {
      label: "Cylinder",
      od: plan.contactLensManagement?.finalRx?.od?.cylinder,
      os: plan.contactLensManagement?.finalRx?.os?.cylinder,
    },
    {
      label: "Axis",
      od: plan.contactLensManagement?.finalRx?.od?.axis,
      os: plan.contactLensManagement?.finalRx?.os?.axis,
    },
    {
      label: "BC",
      od: plan.contactLensManagement?.finalRx?.od?.bc,
      os: plan.contactLensManagement?.finalRx?.os?.bc,
    },
    {
      label: "DIA",
      od: plan.contactLensManagement?.finalRx?.od?.dia,
      os: plan.contactLensManagement?.finalRx?.os?.dia,
    },
    {
      label: "OZD",
      od: plan.contactLensManagement?.finalRx?.od?.ozd,
      os: plan.contactLensManagement?.finalRx?.os?.ozd,
    },
    {
      label: "SC",
      od: plan.contactLensManagement?.finalRx?.od?.sc,
      os: plan.contactLensManagement?.finalRx?.os?.sc,
    },
    {
      label: "PC",
      od: plan.contactLensManagement?.finalRx?.od?.pc,
      os: plan.contactLensManagement?.finalRx?.os?.pc,
    },
    {
      label: "CT",
      od: plan.contactLensManagement?.finalRx?.od?.ct,
      os: plan.contactLensManagement?.finalRx?.os?.ct,
    },
    {
      label: "Material",
      od: plan.contactLensManagement?.finalRx?.od?.material,
      os: plan.contactLensManagement?.finalRx?.os?.material,
    },
    {
      label: "Tint",
      od: plan.contactLensManagement?.finalRx?.od?.tint,
      os: plan.contactLensManagement?.finalRx?.os?.tint,
    },
  ];

  const patchingStatus =
    [
      plan.therapy?.patching?.patchREye ? "Right Eye" : "",
      plan.therapy?.patching?.patchLEye ? "Left Eye" : "",
    ]
      .filter(Boolean)
      .join(" & ") || FALLBACK;

  return `
        <div class="page-break"></div>
        <h1 class="page-title">Plan of Management</h1>

        <div class="section-header">Slit Lamp Management</div>
        <div class="info-grid">
            <div class="info-item"><span class="label">OD (Right Eye):</span><span class="value">${
              plan.slitLampManagement?.od || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">OS (Left Eye):</span><span class="value">${
              plan.slitLampManagement?.os || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Optical Management</div>
        ${generateEyeDataTableHtml(
          "Final Optical Prescription (Final Rx)",
          opticalRxRows
        )}
        <div class="info-grid sub-section">
            <div class="info-item"><span class="label">Materials:</span><span class="value">${
              plan.opticalManagement?.materials || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Coating:</span><span class="value">${
              plan.opticalManagement?.coating || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Tint:</span><span class="value">${
              plan.opticalManagement?.tint || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Design:</span><span class="value">${
              plan.opticalManagement?.design || FALLBACK
            }</span></div>
            <div class="info-item full-width"><span class="label">Frames:</span><span class="value">${
              plan.opticalManagement?.frames || FALLBACK
            }</span></div>
            <div class="info-item full-width section-title"><span class="label">Frame Measurements</span></div>
            <div class="info-item"><span class="label">A:</span><span class="value">${
              plan.opticalManagement?.frameMeasurements?.a || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">B:</span><span class="value">${
              plan.opticalManagement?.frameMeasurements?.b || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">ED:</span><span class="value">${
              plan.opticalManagement?.frameMeasurements?.ed || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">DBL:</span><span class="value">${
              plan.opticalManagement?.frameMeasurements?.dbl || FALLBACK
            }</span></div>
            <div class="info-item full-width"><span class="label">Glazing Instruction:</span><span class="value">${
              plan.opticalManagement?.glazingInstruction || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Contact Lens Management</div>
        ${generateEyeDataTableHtml(
          "Final Contact Lens Prescription (Final Rx)",
          contactLensRxRows
        )}
        <div class="info-grid sub-section">
            <div class="info-item"><span class="label">Design:</span><span class="value">${
              plan.contactLensManagement?.design || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Brand:</span><span class="value">${
              plan.contactLensManagement?.brand || FALLBACK
            }</span></div>
            <div class="info-item full-width"><span class="label">Others:</span><span class="value">${
              plan.contactLensManagement?.others || FALLBACK
            }</span></div>
        </div>

        <div class="section-header">Eye Care Solutions & Therapy</div>
        <div class="info-grid">
            <div class="info-item"><span class="label">Lubricant:</span><span class="value">${
              plan.eyeCareSolutions?.lubricant || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Contact Lens Solutions:</span><span class="value">${
              plan.eyeCareSolutions?.contactLensSolutions || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Eye Vitamins:</span><span class="value">${
              plan.eyeCareSolutions?.eyeVitamins || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Lid Wipes:</span><span class="value">${
              plan.eyeCareSolutions?.lidWipes || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Warm/Cold Compress:</span><span class="value">${
              plan.eyeCareSolutions?.warmColdCompress || FALLBACK
            }</span></div>
             <div class="info-item full-width section-title"><span class="label">Therapy</span></div>
            <div class="info-item"><span class="label">Amblyopia:</span><span class="value">${
              plan.therapy?.amblyopia || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Patching:</span><span class="value">${patchingStatus}</span></div>
            <div class="info-item"><span class="label">Time/Duration:</span><span class="value">${
              plan.therapy?.time || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Other Details:</span><span class="value">${
              plan.therapy?.others || FALLBACK
            }</span></div>
        </div>
        
        <div class="section-header">Ocular Hygiene Recommendations</div>
        ${drawChecklist(plan.ocularHygiene)}

        <div class="section-header">Referral & Follow-Up</div>
        <div class="info-grid">
            <div class="info-item"><span class="label">Referral To:</span><span class="value">${
              plan.referralAndFollowUp?.referralTo || FALLBACK
            }</span></div>
            <div class="info-item"><span class="label">Purpose:</span><span class="value">${
              plan.referralAndFollowUp?.purpose || FALLBACK
            }</span></div>
            <div class="info-item full-width"><span class="label">Next Appointment:</span><span class="value">${
              plan.referralAndFollowUp?.nextAppointment || FALLBACK
            }</span></div>
        </div>
    `;
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
                :root {
                    --primary-color: #7F0000;
                    --header-color: #1A202C;
                    --text-color: #4A5568;
                    --label-color: #2D3748;
                    --border-color: #EAEAEA;
                }
                html { -webkit-print-color-adjust: exact; }
                body { font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 50px; background: #fff; font-size: 10pt; color: var(--text-color); }
                .header, .footer { display: none; }
                .page-break { page-break-before: always; }

                /* General Content Styles */
                h1, .page-title { font-size: 16pt; color: var(--header-color); margin-bottom: 20px; }
                h2 { font-size: 22pt; color: var(--header-color); margin: 0 0 5px 0; }
                p { margin: 0; }
                h3 { font-size: 10pt; color: var(--label-color); margin: 15px 0 5px 0; padding-left: 15px; }

                .header-content { display: flex; justify-content: space-between; align-items: flex-start; }
                .profile-placeholder { width: 120px; height: 120px; background: #EAEAEA; display: flex; align-items: center; justify-content: center; font-size: 9pt; color: var(--text-color); }
                .patient-identifier { margin-top: 20px; margin-bottom: 20px; }
                
                .section-header { background-color: var(--primary-color); color: white; font-weight: bold; padding: 7px 15px; margin-top: 20px; margin-bottom: 15px; font-size: 12pt; border-radius: 3px; }
                
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 40px; padding-left: 15px; }
                .info-grid.sub-section { margin-top: 15px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color); }
                .info-item { display: flex; justify-content: space-between; align-items: baseline; padding: 4px 0; }
                .info-item.full-width { grid-column: 1 / -1; }
                .info-item .label { font-weight: bold; color: var(--label-color); font-size: 9pt; white-space: nowrap; margin-right: 10px; }
                .info-item .value { font-size: 9pt; text-align: right; }
                
                .info-item.section-title .label { font-size: 10pt; color: var(--header-color); border-bottom: 1px solid var(--border-color); width: 100%; }

                .complaint-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 10px 40px; padding-left: 15px; }
                
                .sub-section { margin-bottom: 15px; }
                .eye-data-table { display: grid; grid-template-columns: 2fr 1.5fr 1.5fr; gap: 5px 15px; padding: 0 15px; font-size: 9pt; }
                .eye-data-table .table-header { grid-column: 1 / -1; display: contents; font-weight: bold; color: var(--label-color); }
                .eye-data-table .table-row { grid-column: 1 / -1; display: contents; }
                .eye-data-table .table-row .value, .eye-data-table .table-row .label { border-bottom: 1px solid #f3f3f3; padding-bottom: 5px; }
                .eye-data-table .table-row .label { font-weight: bold; color: var(--label-color); }

                 .paragraph-block {
                    padding: 0 15px;
                    font-size: 9pt;
                    line-height: 1.5;
                }
                .checklist-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr; /* 3 columns */
                    gap: 10px 20px;
                    padding: 0 15px;
                    font-size: 9pt;
                }
                .check-item {
                    display: flex;
                    align-items: center;
                }
                .check-icon {
                    color: #38A169; /* Green */
                    font-weight: bold;
                    margin-right: 8px;
                }
                .cross-icon {
                    color: #E53E3E; /* Red */
                    font-weight: bold;
                    margin-right: 8px;
                }
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
