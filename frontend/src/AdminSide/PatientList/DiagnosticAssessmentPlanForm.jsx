// src/components/DiagnosticAssessmentPlanForm.jsx
import React from "react";

// A reusable component for input fields in the Plan/Management section
const ManagementInput = ({ label, value, onChange }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm text-gray-700 w-20">{label}:</label>
    <input
      type="text"
      placeholder="..."
      value={value}
      onChange={onChange}
      className="flex-1 w-full border-b border-gray-400 focus:border-[#7F0000] outline-none transition-colors py-1"
    />
  </div>
);

// A reusable component for the checkboxes
const DiagnosticTestCheckbox = ({ label, name, checked, onChange }) => (
  <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-[#8B0000] focus:ring-[#7F0000]"
    />
    <span>{label}</span>
  </label>
);

const DiagnosticAssessmentPlanForm = ({
  diagnosticPlan,
  setDiagnosticPlan,
}) => {
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDiagnosticPlan((prev) => ({
      ...prev,
      diagnosticTests: {
        ...prev.diagnosticTests,
        [name]: checked,
      },
    }));
  };

  const handleTextChange = (section, field, value) => {
    setDiagnosticPlan((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePlanManagementChange = (index, eye, field, value) => {
    setDiagnosticPlan((prev) => {
      const newPlanManagement = [...prev.planManagement];
      newPlanManagement[index][eye][field] = value;
      return {
        ...prev,
        planManagement: newPlanManagement,
      };
    });
  };

  const tests = [
    { name: "aberrometry", label: "Aberrometry" },
    { name: "cornealTopography", label: "Corneal Topography" },
    { name: "pachymetry", label: "Pachymetry" },
    { name: "biometry", label: "Biometry" },
    { name: "visualField", label: "Visual Field" },
    { name: "glareAndContrast", label: "Glare & Contrast Tests" },
    { name: "fundusPhoto", label: "Fundus Photo" },
    { name: "anteriorOct", label: "Anterior OCT" },
    { name: "posteriorOct", label: "Posterior OCT" },
    { name: "nerveFiberAnalyzer", label: "Nerve Fiber Layer Analyzer" },
  ];

  return (
    <div className="shadow-md rounded-xl p-4 sm:p-6 border border-[#7F0000] bg-white font-sans mt-6">
      <div className="p-4 border border-[#7F0000] rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#7F0000] mb-4">
          Other Diagnostic Tests Results & Interpretation
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
          {tests.map((test) => (
            <DiagnosticTestCheckbox
              key={test.name}
              label={test.label}
              name={test.name}
              checked={diagnosticPlan.diagnosticTests[test.name]}
              onChange={handleCheckboxChange}
            />
          ))}
        </div>
        <div>
          <label
            htmlFor="interpretation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Brief Interpretation of Results
          </label>
          <textarea
            id="interpretation"
            rows="4"
            placeholder="Enter interpretation of results..."
            value={diagnosticPlan.interpretationOfResults}
            onChange={(e) =>
              setDiagnosticPlan((prev) => ({
                ...prev,
                interpretationOfResults: e.target.value,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000] transition"
          ></textarea>
        </div>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-bold text-center text-[#7F0000] py-2 border-t-2 border-b-2 border-[#7F0000] uppercase">
          ASSESSMENT / DIAGNOSIS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label
              htmlFor="primary-impression"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Primary Impression:
            </label>
            <textarea
              id="primary-impression"
              rows="3"
              placeholder="Enter primary impression..."
              value={diagnosticPlan.assessment.primaryImpression}
              onChange={(e) =>
                handleTextChange(
                  "assessment",
                  "primaryImpression",
                  e.target.value
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000] transition"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="secondary-impression"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Secondary Impression:
            </label>
            <textarea
              id="secondary-impression"
              rows="3"
              placeholder="Enter secondary impression..."
              value={diagnosticPlan.assessment.secondaryImpression}
              onChange={(e) =>
                handleTextChange(
                  "assessment",
                  "secondaryImpression",
                  e.target.value
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000] transition"
            ></textarea>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-center text-[#7F0000] mb-4 pb-2 border-b-2 border-[#7F0000] uppercase">
          PLAN / MANAGEMENT
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {[0, 1].map((index) => (
            <div className="space-y-4" key={index}>
              <h4 className="font-semibold text-gray-800">
                Medical Management:
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <span className="font-bold text-center">OD</span>
                <span className="font-bold text-center">OS</span>
                <div className="space-y-3">
                  {Object.keys(diagnosticPlan.planManagement[index].od).map(
                    (field) => (
                      <ManagementInput
                        key={`od-${index}-${field}`}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={diagnosticPlan.planManagement[index].od[field]}
                        onChange={(e) =>
                          handlePlanManagementChange(
                            index,
                            "od",
                            field,
                            e.target.value
                          )
                        }
                      />
                    )
                  )}
                </div>
                <div className="space-y-3">
                  {Object.keys(diagnosticPlan.planManagement[index].os).map(
                    (field) => (
                      <ManagementInput
                        key={`os-${index}-${field}`}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={diagnosticPlan.planManagement[index].os[field]}
                        onChange={(e) =>
                          handlePlanManagementChange(
                            index,
                            "os",
                            field,
                            e.target.value
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticAssessmentPlanForm;
