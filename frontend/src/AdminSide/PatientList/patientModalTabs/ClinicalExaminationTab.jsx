import React from "react";
import { FaEye } from "react-icons/fa";

// Helper to safely get nested values for form inputs
const getNestedValue = (obj, path) => {
  if (!obj || !path) return "";
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Reusable input component for this tab
const ClinicalExamInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  isEditing,
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

const ClinicalExaminationTab = ({
  isEditing,
  clinicalExaminationData,
  handleClinicalExaminationChange,
}) => {
  const isClinicalExamEmpty = !Object.values(clinicalExaminationData).some(
    (section) =>
      typeof section === "object" && section !== null
        ? Object.values(section).some(
            (value) =>
              (typeof value === "object" &&
                value !== null &&
                Object.values(value).length > 0) ||
              (typeof value !== "object" && value)
          )
        : section
  );

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <FaEye className="mr-2 text-deep-red" />
        Clinical Examination
      </h4>
      {isClinicalExamEmpty && !isEditing ? (
        <div className="text-center py-4">
          <p className="text-gray-500 italic">
            No clinical examination records found for this patient.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Visual Acuity */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">Visual Acuity</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <ClinicalExamInput
                name="visualAcuity.chartUsed"
                label="Chart Used"
                value={getNestedValue(
                  clinicalExaminationData,
                  "visualAcuity.chartUsed"
                )}
                onChange={handleClinicalExaminationChange}
                isEditing={isEditing}
              />
              <ClinicalExamInput
                name="visualAcuity.testDistanceUsed"
                label="Test Distance Used"
                value={getNestedValue(
                  clinicalExaminationData,
                  "visualAcuity.testDistanceUsed"
                )}
                onChange={handleClinicalExaminationChange}
                isEditing={isEditing}
              />
              <ClinicalExamInput
                name="visualAcuity.testDistanceOther"
                label="Other"
                value={getNestedValue(
                  clinicalExaminationData,
                  "visualAcuity.testDistanceOther"
                )}
                onChange={handleClinicalExaminationChange}
                isEditing={isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              {/* Without Glasses */}
              <div>
                <h6 className="font-medium text-gray-700 mb-2 border-b pb-1">
                  Without Glasses
                </h6>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-center mb-1">OD</p>
                    <ClinicalExamInput
                      name="visualAcuity.withoutGlasses.od.sc"
                      label="SC"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withoutGlasses.od.sc"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withoutGlasses.od.ph"
                      label="PH"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withoutGlasses.od.ph"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withoutGlasses.od.near"
                      label="Near"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withoutGlasses.od.near"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-center mb-1">OS</p>
                    <ClinicalExamInput
                      name="visualAcuity.withoutGlasses.os.sc"
                      label="SC"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withoutGlasses.os.sc"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withoutGlasses.os.ph"
                      label="PH"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withoutGlasses.os.ph"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withoutGlasses.os.near"
                      label="Near"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withoutGlasses.os.near"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                  </div>
                </div>
              </div>
              {/* With Glasses */}
              <div>
                <h6 className="font-medium text-gray-700 mb-2 border-b pb-1">
                  With Glasses
                </h6>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-center mb-1">OD</p>
                    <ClinicalExamInput
                      name="visualAcuity.withGlasses.od.sc"
                      label="SC"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withGlasses.od.sc"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withGlasses.od.ph"
                      label="PH"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withGlasses.od.ph"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withGlasses.od.near"
                      label="Near"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withGlasses.od.near"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-center mb-1">OS</p>
                    <ClinicalExamInput
                      name="visualAcuity.withGlasses.os.sc"
                      label="SC"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withGlasses.os.sc"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withGlasses.os.ph"
                      label="PH"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withGlasses.os.ph"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                    <ClinicalExamInput
                      name="visualAcuity.withGlasses.os.near"
                      label="Near"
                      value={getNestedValue(
                        clinicalExaminationData,
                        "visualAcuity.withGlasses.os.near"
                      )}
                      onChange={handleClinicalExaminationChange}
                      isEditing={isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Dominant Eye */}
            <div>
              <h6 className="font-medium text-gray-700 mb-2 border-b pb-1">
                Dominant Eye
              </h6>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-center mb-1">Far</p>
                  <ClinicalExamInput
                    name="visualAcuity.dominantEye.far.od"
                    label="OD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "visualAcuity.dominantEye.far.od"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="visualAcuity.dominantEye.far.os"
                    label="OS"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "visualAcuity.dominantEye.far.os"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-center mb-1">Near</p>
                  <ClinicalExamInput
                    name="visualAcuity.dominantEye.near.od"
                    label="OD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "visualAcuity.dominantEye.near.od"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="visualAcuity.dominantEye.near.os"
                    label="OS"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "visualAcuity.dominantEye.near.os"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Autorefractometer & Autokeratometer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Autorefractometer
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OD</h6>
                  <ClinicalExamInput
                    name="autorefractometer.od.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autorefractometer.od.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autorefractometer.od.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autorefractometer.od.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autorefractometer.od.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autorefractometer.od.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OS</h6>
                  <ClinicalExamInput
                    name="autorefractometer.os.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autorefractometer.os.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autorefractometer.os.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autorefractometer.os.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autorefractometer.os.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autorefractometer.os.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Autokeratometer
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OD</h6>
                  <ClinicalExamInput
                    name="autokeratometer.od.k1"
                    label="K1"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autokeratometer.od.k1"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autokeratometer.od.k2"
                    label="K2"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autokeratometer.od.k2"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autokeratometer.od.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autokeratometer.od.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OS</h6>
                  <ClinicalExamInput
                    name="autokeratometer.os.k1"
                    label="K1"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autokeratometer.os.k1"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autokeratometer.os.k2"
                    label="K2"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autokeratometer.os.k2"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="autokeratometer.os.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "autokeratometer.os.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PD & Pupil Examination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                PD & Pupil Size
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OD</h6>
                  <ClinicalExamInput
                    name="pdPupilSize.od.mpd"
                    label="MPD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pdPupilSize.od.mpd"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pdPupilSize.od.pupilSize"
                    label="Pupil Size"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pdPupilSize.od.pupilSize"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pdPupilSize.od.hvid"
                    label="HVID"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pdPupilSize.od.hvid"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OS</h6>
                  <ClinicalExamInput
                    name="pdPupilSize.os.mpd"
                    label="MPD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pdPupilSize.os.mpd"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pdPupilSize.os.pupilSize"
                    label="Pupil Size"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pdPupilSize.os.pupilSize"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pdPupilSize.os.hvid"
                    label="HVID"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pdPupilSize.os.hvid"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Pupil Examination
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OD</h6>
                  <ClinicalExamInput
                    name="pupilExamination.od.rapd"
                    label="RAPD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.od.rapd"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pupilExamination.od.direct"
                    label="Direct"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.od.direct"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pupilExamination.od.consensual"
                    label="Consensual"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.od.consensual"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pupilExamination.od.perrla"
                    label="PERRLA"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.od.perrla"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OS</h6>
                  <ClinicalExamInput
                    name="pupilExamination.os.rapd"
                    label="RAPD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.os.rapd"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pupilExamination.os.direct"
                    label="Direct"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.os.direct"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pupilExamination.os.consensual"
                    label="Consensual"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.os.consensual"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="pupilExamination.os.perrla"
                    label="PERRLA"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "pupilExamination.os.perrla"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Manifest Refraction */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Manifest Refraction
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="font-medium text-gray-700 mb-2">
                  OD (Right Eye)
                </h6>
                <div className="grid grid-cols-2 gap-x-4">
                  <ClinicalExamInput
                    name="manifestRefraction.od.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.od.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.od.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.od.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.od.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.od.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.od.va"
                    label="VA"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.od.va"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.od.add"
                    label="ADD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.od.add"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.od.nva"
                    label="NVA"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.od.nva"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
              <div>
                <h6 className="font-medium text-gray-700 mb-2">
                  OS (Left Eye)
                </h6>
                <div className="grid grid-cols-2 gap-x-4">
                  <ClinicalExamInput
                    name="manifestRefraction.os.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.os.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.os.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.os.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.os.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.os.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.os.va"
                    label="VA"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.os.va"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.os.add"
                    label="ADD"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.os.add"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="manifestRefraction.os.nva"
                    label="NVA"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "manifestRefraction.os.nva"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cycloplegic AR & Subj. Refraction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Cycloplegic AR
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OD</h6>
                  <ClinicalExamInput
                    name="cycloplegicAR.od.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicAR.od.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicAR.od.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicAR.od.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicAR.od.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicAR.od.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OS</h6>
                  <ClinicalExamInput
                    name="cycloplegicAR.os.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicAR.os.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicAR.os.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicAR.os.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicAR.os.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicAR.os.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Cycloplegic Subj. Refraction
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OD</h6>
                  <ClinicalExamInput
                    name="cycloplegicSubjRefraction.od.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicSubjRefraction.od.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicSubjRefraction.od.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicSubjRefraction.od.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicSubjRefraction.od.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicSubjRefraction.od.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
                <div>
                  <h6 className="font-medium text-gray-700 mb-2">OS</h6>
                  <ClinicalExamInput
                    name="cycloplegicSubjRefraction.os.sphere"
                    label="Sphere"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicSubjRefraction.os.sphere"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicSubjRefraction.os.cylinder"
                    label="Cylinder"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicSubjRefraction.os.cylinder"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                  <ClinicalExamInput
                    name="cycloplegicSubjRefraction.os.axis"
                    label="Axis"
                    value={getNestedValue(
                      clinicalExaminationData,
                      "cycloplegicSubjRefraction.os.axis"
                    )}
                    onChange={handleClinicalExaminationChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ARK Results & Meds Used */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Additional Info
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ClinicalExamInput
                name="arkResults"
                label="ARK Results"
                value={getNestedValue(clinicalExaminationData, "arkResults")}
                onChange={handleClinicalExaminationChange}
                isEditing={isEditing}
              />
              <ClinicalExamInput
                name="medsUsed.type"
                label="Meds Used: Type"
                value={getNestedValue(clinicalExaminationData, "medsUsed.type")}
                onChange={handleClinicalExaminationChange}
                isEditing={isEditing}
              />
              <ClinicalExamInput
                name="medsUsed.comboTCOthers"
                label="Meds Used: Combo/TC/Others"
                value={getNestedValue(
                  clinicalExaminationData,
                  "medsUsed.comboTCOthers"
                )}
                onChange={handleClinicalExaminationChange}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalExaminationTab;
