import React from "react";
import { FaVial } from "react-icons/fa";

// Helper to safely get nested values from the data object
const getNestedValue = (obj, path) => {
  if (!obj || !path) return "";
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Reusable Input component for this tab
const DiagnosticPlanInput = ({
  name,
  label,
  value,
  onChange,
  isEditing,
  placeholder,
}) => (
  <div className="mb-2">
    <label className="text-sm text-gray-600 mb-1 block" htmlFor={name}>
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={!isEditing}
      className="font-medium w-full p-2 border border-gray-200 rounded-md disabled:bg-gray-100 focus:ring-deep-red focus:border-deep-red"
      placeholder={placeholder}
    />
  </div>
);

// Reusable Checkbox component for this tab
const DiagnosticPlanCheckbox = ({
  name,
  label,
  checked,
  onChange,
  isEditing,
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={!!checked}
      onChange={onChange}
      disabled={!isEditing}
      className="h-4 w-4 rounded border-gray-300 text-deep-red focus:ring-deep-red"
    />
    <label htmlFor={name} className="ml-2 text-gray-700">
      {label}
    </label>
  </div>
);

const DiagnosticPlanTab = ({
  isEditing,
  diagnosticPlanData,
  handleDiagnosticPlanChange,
}) => {
  const isDiagnosticPlanEmpty =
    !diagnosticPlanData ||
    (Object.keys(diagnosticPlanData.diagnosticTests || {}).every(
      (key) => !diagnosticPlanData.diagnosticTests[key]
    ) &&
      !diagnosticPlanData.interpretationOfResults &&
      !diagnosticPlanData.assessment?.primaryImpression &&
      !diagnosticPlanData.assessment?.secondaryImpression);

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <FaVial className="mr-2 text-deep-red" />
        Diagnostic Tests & Assessment
      </h4>
      {isDiagnosticPlanEmpty && !isEditing ? (
        <div className="text-center py-4">
          <p className="text-gray-500 italic">
            No diagnostic plan records found for this patient.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Diagnostic Tests */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Diagnostic Tests
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DiagnosticPlanCheckbox
                name="diagnosticTests.aberrometry"
                label="Aberrometry"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.aberrometry"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.cornealTopography"
                label="Corneal Topography"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.cornealTopography"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.pachymetry"
                label="Pachymetry"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.pachymetry"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.biometry"
                label="Biometry"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.biometry"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.visualField"
                label="Visual Field"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.visualField"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.glareAndContrast"
                label="Glare & Contrast"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.glareAndContrast"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.fundusPhoto"
                label="Fundus Photo"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.fundusPhoto"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.anteriorOct"
                label="Anterior OCT"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.anteriorOct"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.posteriorOct"
                label="Posterior OCT"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.posteriorOct"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanCheckbox
                name="diagnosticTests.nerveFiberAnalyzer"
                label="Nerve Fiber Analyzer"
                checked={getNestedValue(
                  diagnosticPlanData,
                  "diagnosticTests.nerveFiberAnalyzer"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Interpretation of Results */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Interpretation of Results
            </h5>
            <textarea
              name="interpretationOfResults"
              value={diagnosticPlanData.interpretationOfResults || ""}
              onChange={handleDiagnosticPlanChange}
              disabled={!isEditing}
              className="font-medium w-full p-2 border border-gray-200 rounded-md disabled:bg-gray-100 focus:ring-deep-red focus:border-deep-red"
              rows="4"
            />
          </div>

          {/* Assessment */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">Assessment</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DiagnosticPlanInput
                name="assessment.primaryImpression"
                label="Primary Impression"
                value={getNestedValue(
                  diagnosticPlanData,
                  "assessment.primaryImpression"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
              <DiagnosticPlanInput
                name="assessment.secondaryImpression"
                label="Secondary Impression"
                value={getNestedValue(
                  diagnosticPlanData,
                  "assessment.secondaryImpression"
                )}
                onChange={handleDiagnosticPlanChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Plan Management Section */}
          <div className="space-y-6">
            {[0, 1].map((index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h5 className="font-semibold mb-3 text-gray-700">
                  Plan Management {index + 1}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OD Column */}
                  <div>
                    <h6 className="font-medium text-center text-gray-700 mb-2">
                      OD
                    </h6>
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.od.meds`}
                      label="Meds"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.od.meds`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.od.quantity`}
                      label="Quantity"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.od.quantity`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.od.frequency`}
                      label="Frequency"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.od.frequency`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.od.duration`}
                      label="Duration"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.od.duration`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                  </div>
                  {/* OS Column */}
                  <div>
                    <h6 className="font-medium text-center text-gray-700 mb-2">
                      OS
                    </h6>
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.os.meds`}
                      label="Meds"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.os.meds`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.os.quantity`}
                      label="Quantity"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.os.quantity`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.os.frequency`}
                      label="Frequency"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.os.frequency`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                    <DiagnosticPlanInput
                      name={`planManagement.${index}.os.duration`}
                      label="Duration"
                      value={getNestedValue(
                        diagnosticPlanData,
                        `planManagement.${index}.os.duration`
                      )}
                      onChange={handleDiagnosticPlanChange}
                      isEditing={isEditing}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticPlanTab;
