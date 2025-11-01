import React, { useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import axios from "axios";

// Import all the form components you'll be using
import CaseHistoryTakingForm from "./CaseHistoryTakingForm";
import ClinicalExaminationForm from "./ClinicalExaminationForm";
import BasicBinocularVisionTests from "./BasicBinocularVisionTests";
import SlitLampFunduscopyForm from "./SlitLampFunduscopyForm";
import DiagnosticAssessmentPlanForm from "./DiagnosticAssessmentPlanForm";
import PlanOfManagementForm from "./PlanOfManagementForm";

const NewVisitModal = ({ isOpen, onClose, onSave, patientId }) => {
  // --- State variables for all clinical forms ---
  // These are copied from your AddPatientModal for consistency
  const [caseHistory, setCaseHistory] = useState({
    chiefComplaint: {
      blurring: false,
      headache: false,
      doubleVision: false,
      photophobia: false,
      itchyEyes: false,
      eyeRedness: false,
      eyePain: false,
      others: "",
    },
    associatedComplaint: {
      blurring: false,
      headache: false,
      doubleVision: false,
      photophobia: false,
      itchyEyes: false,
      eyeRedness: false,
      eyePain: false,
      others: "",
    },
    medicalHistory: {
      hypertension: false,
      cardiovascular: false,
      diabetes: false,
      asthma: false,
      allergies: false,
      congenital: false,
      majorSurgery: false,
      others: "",
    },
    historyOfChiefComplaint: {
      frequency: "",
      onset: "",
      location: "",
      duration: "",
      relief: "",
      quality: "",
    },
    historyOfAssociatedComplaint: {
      frequency: "",
      onset: "",
      location: "",
      duration: "",
      relief: "",
      quality: "",
    },
    familyHistory: {
      hypertension: false,
      cardiovascular: false,
      diabetes: false,
      asthma: false,
      allergies: false,
      others: "",
    },
    ocularHistory: {
      spectacleRx: "",
      spectacleYear: "",
      contactLens: "",
      eyeSurgery: "",
      systemicSurgery: "",
    },
    ocularCondition: {
      glaucoma: false,
      cataract: false,
      retina: "",
      macula: "",
      eor: "",
      others: "",
    },
    familyOcularCondition: {
      glaucoma: false,
      cataract: false,
      retina: "",
      macula: "",
      eor: "",
      others: "",
    },
    occupationalHistory: { working: false, student: false, details: "" },
    digitalHistory: {
      cellphone: "",
      laptop: "",
      desktop: "",
      television: "",
      work: "",
      hobbies: "",
    },
    eyeglassHistory: {
      ddW: "",
      ddWout: "",
      power: "",
      lensType: "",
      comment: "",
    },
  });

  const [clinicalExam, setClinicalExam] = useState({
    visualAcuity: {
      chartUsed: "",
      testDistanceUsed: "",
      testDistanceOther: "",
      withoutGlasses: { od: {}, os: {} },
      withGlasses: { od: {}, os: {} },
      dominantEye: { far: { od: "", os: "" }, near: { od: "", os: "" } },
    },
    autorefractometer: { od: {}, os: {} },
    autokeratometer: { od: {}, os: {} },
    pdPupilSize: { od: {}, os: {} },
    pupilExamination: { od: {}, os: {} },
    manifestRefraction: { od: {}, os: {} },
    cycloplegicAR: { od: {}, os: {} },
    cycloplegicSubjRefraction: { od: {}, os: {} },
    arkResults: "",
    medsUsed: { type: "", comboTCOthers: "" },
  });

  const [binocularTests, setBinocularTests] = useState({
    binocularTests: { angleEst6m: {}, angleEst33cm: {} },
    monocularTests: { npa: {}, ocularMotilityDuction: {} },
  });

  const [slitLampFunduscopy, setSlitLampFunduscopy] = useState({
    slitLamp: { od: {}, os: {} },
    funduscopy: { od: {}, os: {} },
  });

  const [diagnosticPlan, setDiagnosticPlan] = useState({
    diagnosticTests: {
      aberrometry: false,
      cornealTopography: false,
      pachymetry: false,
      biometry: false,
      visualField: false,
      glareAndContrast: false,
      fundusPhoto: false,
      anteriorOct: false,
      posteriorOct: false,
      nerveFiberAnalyzer: false,
    },
    interpretationOfResults: "",
    assessment: { primaryImpression: "", secondaryImpression: "" },
    planManagement: [
      {
        od: { meds: "", quantity: "", frequency: "", duration: "" },
        os: { meds: "", quantity: "", frequency: "", duration: "" },
      },
      {
        od: { meds: "", quantity: "", frequency: "", duration: "" },
        os: { meds: "", quantity: "", frequency: "", duration: "" },
      },
    ],
  });

  const [planOfManagement, setPlanOfManagement] = useState({
    slitLampManagement: {},
    opticalManagement: { finalRx: { od: {}, os: {} }, frameMeasurements: {} },
    contactLensManagement: { finalRx: { od: {}, os: {} } },
    eyeCareSolutions: {},
    therapy: { patching: {} },
    ocularHygiene: {},
    referralAndFollowUp: {},
  });

  const [isSaving, setIsSaving] = useState(false);
  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      // STEP 1: Create a new Visit document for the existing patient.
      // The backend will automatically create all the associated empty clinical records.
      const visitResponse = await axios.post(
        "http://localhost:5000/api/visits",
        { patientId }, // Just need to send the patientId
        headers
      );
      const newVisit = visitResponse.data;

      if (!newVisit?._id) {
        throw new Error("Failed to create new visit record.");
      }

      // STEP 2: Update the newly created (but empty) clinical records with the form data.
      const updatePromises = [
        axios.put(
          `http://localhost:5000/api/casehistory/visit/${newVisit.caseHistory}`,
          caseHistory,
          headers
        ),
        axios.put(
          `http://localhost:5000/api/clinical-examination/visit/${newVisit.clinicalExamination}`,
          clinicalExam,
          headers
        ),
        axios.put(
          `http://localhost:5000/api/binocular-tests/visit/${newVisit.basicBinocularVisionTests}`,
          binocularTests,
          headers
        ),
        axios.put(
          `http://localhost:5000/api/slit-lamp-funduscopy/visit/${newVisit.slitLampFunduscopy}`,
          slitLampFunduscopy,
          headers
        ),
        axios.put(
          `http://localhost:5000/api/diagnostic-assessment-plan/visit/${newVisit.diagnosticAssessmentPlan}`,
          diagnosticPlan,
          headers
        ),
        axios.put(
          `http://localhost:5000/api/plan-of-management/visit/${newVisit.planOfManagement}`,
          planOfManagement,
          headers
        ),
      ];

      await Promise.all(updatePromises);

      // STEP 3: If everything is successful, call the parent component's handlers.
      alert("New visit added successfully!");
      onSave(); // This tells PatientInformationModal to refresh its data
      onClose(); // This closes the modal
    } catch (error) {
      console.error("Failed to add new visit:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              Add New Visit Record
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* --- FORM START --- */}
        <form
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto p-6 space-y-6"
        >
          {/* Render all your form components, passing state and setters */}
          <CaseHistoryTakingForm
            caseHistory={caseHistory}
            setCaseHistory={setCaseHistory}
          />
          <ClinicalExaminationForm
            clinicalExam={clinicalExam}
            setClinicalExam={setClinicalExam}
          />
          <BasicBinocularVisionTests
            binocularTests={binocularTests}
            setBinocularTests={setBinocularTests}
          />
          <SlitLampFunduscopyForm
            slitLampFunduscopy={slitLampFunduscopy}
            setSlitLampFunduscopy={setSlitLampFunduscopy}
          />
          <DiagnosticAssessmentPlanForm
            diagnosticPlan={diagnosticPlan}
            setDiagnosticPlan={setDiagnosticPlan}
          />
          <PlanOfManagementForm
            planOfManagement={planOfManagement}
            setPlanOfManagement={setPlanOfManagement}
          />
        </form>
        {/* --- FORM END --- */}

        {/* --- Modal Footer / Actions --- */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button" // Change to button and trigger form submit via form attribute or onClick
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-5 py-2.5 bg-gradient-to-r from-[#7F0000] to-[#8B0000] text-white rounded-xl hover:opacity-90 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="mr-2" />
              {isSaving ? "Saving..." : "Save Visit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVisitModal;
