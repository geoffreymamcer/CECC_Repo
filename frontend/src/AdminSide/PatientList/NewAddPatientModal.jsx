import React, { useState } from "react";
import {
  Eye,
  ClipboardList,
  CheckCircle,
  Activity,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
} from "https://esm.sh/lucide-react@0.344.0";

// Tailwind color palette applied in your tailwind.config.js
// "deep-red": "#7F0000",
// "dark-red": "#8B0000"

const OptometryCaseForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    chiefComplaint: "",
    associatedComplaints: [],
    medicalHistory: [],
    familyHistory: [],
    ocularHistory: "",
    // Step 2
    visualAcuity: {
      chartUsed: "",
      testDistance: "",
      withoutGlasses: { OD: "", OS: "" },
      withGlasses: { OD: "", OS: "" },
      dominantEye: "",
    },
    autorefractometer: { OD: "", OS: "" },
    pupilExam: { OD: "", OS: "" },
    manifestRefraction: { OD: "", OS: "" },
  });

  const steps = [
    { id: 1, title: "Case History", icon: <ClipboardList /> },
    { id: 2, title: "Clinical Examination", icon: <Stethoscope /> },
    { id: 3, title: "Binocular Tests", icon: <Eye /> },
    { id: 4, title: "Slit Lamp & Funduscopy", icon: <Activity /> },
    { id: 5, title: "Assessment & Plan", icon: <CheckCircle /> },
  ];

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const validateStep = (currentStep) => {
    // Add lightweight validation example:
    if (currentStep === 1 && !formData.chiefComplaint) {
      alert("Please fill out the chief complaint before proceeding.");
      return false;
    }
    return true;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {steps.map((s) => (
          <div
            key={s.id}
            className={`flex-1 flex flex-col items-center text-center ${
              step === s.id
                ? "text-deep-red font-bold"
                : "text-gray-500 hover:text-dark-red"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === s.id
                  ? "border-deep-red bg-deep-red text-white"
                  : "border-gray-300"
              }`}
            >
              {s.icon}
            </div>
            <p className="text-sm mt-2">{s.title}</p>
          </div>
        ))}
      </div>
      {/* Step 1: Case History */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-dark-red mb-4">
            Case History Taking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chief Complaint */}
            <div>
              <label className="block font-semibold text-gray-700">
                Chief Complaint / Reason for Visit
              </label>
              <textarea
                value={formData.chiefComplaint}
                onChange={(e) => handleChange("chiefComplaint", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Describe the main reason for visit..."
              />
            </div>

            {/* Associated Complaints */}
            <div>
              <label className="block font-semibold text-gray-700">
                Associated Complaints
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  "Blurring of vision",
                  "Headache",
                  "Double vision",
                  "Photophobia",
                  "Itchy eyes",
                  "Eye redness",
                  "Eye pain",
                ].map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.associatedComplaints.includes(opt)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        handleChange(
                          "associatedComplaints",
                          checked
                            ? [...formData.associatedComplaints, opt]
                            : formData.associatedComplaints.filter(
                                (c) => c !== opt
                              )
                        );
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-700">
              Medical History
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {[
                "Hypertension",
                "Cardiovascular Problem",
                "Diabetes",
                "Asthma",
                "Allergies",
              ].map((opt) => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.medicalHistory.includes(opt)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      handleChange(
                        "medicalHistory",
                        checked
                          ? [...formData.medicalHistory, opt]
                          : formData.medicalHistory.filter((c) => c !== opt)
                      );
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Family History */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-700">
              Family History
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {[
                "Hypertension",
                "Cardiovascular Problem",
                "Diabetes",
                "Asthma",
                "Allergies",
              ].map((opt) => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.familyHistory.includes(opt)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      handleChange(
                        "familyHistory",
                        checked
                          ? [...formData.familyHistory, opt]
                          : formData.familyHistory.filter((c) => c !== opt)
                      );
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ocular History */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-700">
              Ocular History
            </label>
            <textarea
              value={formData.ocularHistory}
              onChange={(e) => handleChange("ocularHistory", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              placeholder="Include spectacles, eye surgery, systemic surgery..."
            />
          </div>
        </div>
      )}
      {/* Step 2: Clinical Examination */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold text-dark-red mb-4">
            Clinical Examination
          </h2>

          {/* Visual Acuity */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 text-deep-red">Visual Acuity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700">
                  Chart Used
                </label>
                <input
                  type="text"
                  value={formData.visualAcuity.chartUsed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visualAcuity: {
                        ...formData.visualAcuity,
                        chartUsed: e.target.value,
                      },
                    })
                  }
                  className="border rounded-md p-2 w-full"
                  placeholder="Snellen / Metric / Decimal / Logmar"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">
                  Test Distance Used
                </label>
                <input
                  type="text"
                  value={formData.visualAcuity.testDistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visualAcuity: {
                        ...formData.visualAcuity,
                        testDistance: e.target.value,
                      },
                    })
                  }
                  className="border rounded-md p-2 w-full"
                  placeholder="6M / 4M / 3M / Others"
                />
              </div>
            </div>
          </div>

          {/* Refraction Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["OD", "OS"].map((eye) => (
              <div key={eye} className="border rounded-lg p-4">
                <h3 className="font-semibold text-deep-red mb-2">
                  Manifest Refraction ({eye})
                </h3>
                {["Sphere", "Cylinder", "Axis", "VA", "ADD", "NVA"].map(
                  (field) => (
                    <div key={field} className="mb-2">
                      <label className="block text-sm font-medium">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={formData.manifestRefraction[eye][field] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            manifestRefraction: {
                              ...formData.manifestRefraction,
                              [eye]: {
                                ...formData.manifestRefraction[eye],
                                [field]: e.target.value,
                              },
                            },
                          })
                        }
                        className="border rounded-md p-2 w-full"
                      />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}{" "}
      {/* Step 3: Basic Binocular Vision Tests */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold text-dark-red mb-4">
            Basic Binocular Vision Tests
          </h2>

          {/* Near Point of Convergence & Maddox Wing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-gray-700">
                Near Point of Convergence (NPC)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="e.g., 6 cm / 10 cm"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">
                Maddox Wing / Maddox Rod
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Horizontal / Vertical deviation"
              />
            </div>
          </div>

          {/* Cover Test & Angle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block font-semibold text-gray-700">
                Cover Test (6m / 33cm)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Orthophoria / Exo / Eso"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">
                Angle Estimated / Measured
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="e.g., 15Δ Exo"
              />
            </div>
          </div>

          {/* Bagolini Test */}
          <div className="mt-6">
            <label className="block font-semibold text-gray-700">
              Bagolini Test
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              placeholder="Fusion / Suppression / Diplopia"
            />
          </div>

          {/* Monocular Tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {["OD", "OS"].map((eye) => (
              <div key={eye} className="border rounded-lg p-4">
                <h3 className="font-semibold text-deep-red mb-2">
                  Monocular Tests ({eye})
                </h3>
                <label className="block text-sm font-medium mb-1">
                  Worth 4 Dot
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full mb-2"
                  placeholder="Fusion / Suppression"
                />
                <label className="block text-sm font-medium mb-1">
                  Stereopsis
                </label>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  placeholder="e.g., 60” arc"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Step 4: Slit Lamp & Funduscopy */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold text-dark-red mb-4">
            Slit Lamp & Funduscopy
          </h2>

          {/* Slit Lamp Exam */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-deep-red mb-2">Slit Lamp Exam</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Lids/Lashes",
                "Conjunctiva",
                "Cornea",
                "Iris",
                "Lens",
                "Anterior Chamber",
              ].map((part) => (
                <div key={part}>
                  <label className="block text-sm font-medium">{part}</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full"
                    placeholder={`Describe ${part.toLowerCase()} findings...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* IOP */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-deep-red mb-2">
              Intraocular Pressure (IOP)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {["OD", "OS"].map((eye) => (
                <div key={eye}>
                  <label className="block text-sm font-medium">{eye}</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full"
                    placeholder="mmHg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Funduscopy */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-deep-red mb-2">
              Fundus Examination
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Optic Disc",
                "CDR",
                "Macula",
                "Vessels",
                "Retina (Periphery)",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium">{field}</label>
                  <input
                    type="text"
                    className="border rounded-md p-2 w-full"
                    placeholder={`Describe ${field.toLowerCase()} findings...`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Step 5: Assessment & Plan */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold text-dark-red mb-4">
            Assessment & Plan of Management
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700">
                Primary Impression
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Enter the primary diagnosis or impression..."
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Secondary Impression
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Enter secondary findings or differential diagnosis..."
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Medical Management
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Treatment, referrals, medications..."
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Optical Management
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Spectacle or lens prescription..."
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Contact Lens Management
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Lens type, wear schedule, follow-up..."
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Ocular Hygiene & Advice
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="Patient counseling and advice..."
              />
            </div>
          </div>
        </div>
      )}
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            <ChevronLeft className="mr-2" /> Previous
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            onClick={handleNext}
            className="flex items-center bg-deep-red text-white px-4 py-2 rounded-lg hover:bg-dark-red"
          >
            Next <ChevronRight className="ml-2" />
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            onClick={() => alert("Form submitted!")}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default OptometryCaseForm;
