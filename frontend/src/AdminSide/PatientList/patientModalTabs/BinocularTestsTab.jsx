import React from "react";
import { FaLowVision } from "react-icons/fa";

// Helper to safely get nested values for form inputs
const getNestedValue = (obj, path) => {
  if (!obj || !path) return "";
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Reusable input component for this tab
const BinocularTestInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  isEditing,
}) => (
  <div>
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

const BinocularTestsTab = ({
  isEditing,
  basicBinocularTestsData,
  handleBinocularTestsChange,
}) => {
  const isBinocularTestsEmpty =
    !basicBinocularTestsData ||
    (Object.keys(basicBinocularTestsData.binocularTests || {}).every(
      (key) => !basicBinocularTestsData.binocularTests[key]
    ) &&
      Object.keys(basicBinocularTestsData.monocularTests || {}).every(
        (key) => !basicBinocularTestsData.monocularTests[key]
      ));

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <FaLowVision className="mr-2 text-deep-red" />
        Basic Binocular Vision Tests
      </h4>
      {isBinocularTestsEmpty && !isEditing ? (
        <div className="text-center py-4">
          <p className="text-gray-500 italic">
            No binocular vision test records found for this patient.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Binocular Tests Section */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Binocular Tests
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BinocularTestInput
                name="binocularTests.stereoAcuityLangs"
                label="Stereo Acuity (Langs)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.stereoAcuityLangs"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.stereoAcuityCircles"
                label="Stereo Acuity (Circles)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.stereoAcuityCircles"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.ocularMotilityVersion"
                label="Ocular Motility (Version)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.ocularMotilityVersion"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.npc"
                label="NPC"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.npc"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.w4l6m"
                label="W4L (6m)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.w4l6m"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.w4l33cm"
                label="W4L (33cm)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.w4l33cm"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.maddoxWing"
                label="Maddox Wing"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.maddoxWing"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.ct6m"
                label="CT (6m)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.ct6m"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.ct33cm"
                label="CT (33cm)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.ct33cm"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.bagolini33cm"
                label="Bagolini (33cm)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.bagolini33cm"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.bagolini6m"
                label="Bagolini (6m)"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.bagolini6m"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
              <BinocularTestInput
                name="binocularTests.otherTests"
                label="Other Tests"
                value={getNestedValue(
                  basicBinocularTestsData,
                  "binocularTests.otherTests"
                )}
                onChange={handleBinocularTestsChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Angle Estimation Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Angle Estimation (6m)
              </h5>
              <div className="space-y-2">
                <BinocularTestInput
                  name="binocularTests.angleEst6m.hirschbergs"
                  label="Hirschberg's"
                  value={getNestedValue(
                    basicBinocularTestsData,
                    "binocularTests.angleEst6m.hirschbergs"
                  )}
                  onChange={handleBinocularTestsChange}
                  isEditing={isEditing}
                />
                <BinocularTestInput
                  name="binocularTests.angleEst6m.krimsky"
                  label="Krimsky"
                  value={getNestedValue(
                    basicBinocularTestsData,
                    "binocularTests.angleEst6m.krimsky"
                  )}
                  onChange={handleBinocularTestsChange}
                  isEditing={isEditing}
                />
                <BinocularTestInput
                  name="binocularTests.angleEst6m.pct"
                  label="PCT"
                  value={getNestedValue(
                    basicBinocularTestsData,
                    "binocularTests.angleEst6m.pct"
                  )}
                  onChange={handleBinocularTestsChange}
                  isEditing={isEditing}
                />
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Angle Estimation (33cm)
              </h5>
              <div className="space-y-2">
                <BinocularTestInput
                  name="binocularTests.angleEst33cm.hirschbergs"
                  label="Hirschberg's"
                  value={getNestedValue(
                    basicBinocularTestsData,
                    "binocularTests.angleEst33cm.hirschbergs"
                  )}
                  onChange={handleBinocularTestsChange}
                  isEditing={isEditing}
                />
                <BinocularTestInput
                  name="binocularTests.angleEst33cm.krimsky"
                  label="Krimsky"
                  value={getNestedValue(
                    basicBinocularTestsData,
                    "binocularTests.angleEst33cm.krimsky"
                  )}
                  onChange={handleBinocularTestsChange}
                  isEditing={isEditing}
                />
                <BinocularTestInput
                  name="binocularTests.angleEst33cm.pct"
                  label="PCT"
                  value={getNestedValue(
                    basicBinocularTestsData,
                    "binocularTests.angleEst33cm.pct"
                  )}
                  onChange={handleBinocularTestsChange}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </div>

          {/* Monocular Tests Section */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Monocular Tests
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="font-medium text-gray-700 mb-2">NPA</h6>
                <div className="grid grid-cols-2 gap-4">
                  <BinocularTestInput
                    name="monocularTests.npa.od"
                    label="OD"
                    value={getNestedValue(
                      basicBinocularTestsData,
                      "monocularTests.npa.od"
                    )}
                    onChange={handleBinocularTestsChange}
                    isEditing={isEditing}
                  />
                  <BinocularTestInput
                    name="monocularTests.npa.os"
                    label="OS"
                    value={getNestedValue(
                      basicBinocularTestsData,
                      "monocularTests.npa.os"
                    )}
                    onChange={handleBinocularTestsChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
              <div>
                <h6 className="font-medium text-gray-700 mb-2">
                  Ocular Motility (Duction)
                </h6>
                <div className="grid grid-cols-2 gap-4">
                  <BinocularTestInput
                    name="monocularTests.ocularMotilityDuction.od"
                    label="OD"
                    value={getNestedValue(
                      basicBinocularTestsData,
                      "monocularTests.ocularMotilityDuction.od"
                    )}
                    onChange={handleBinocularTestsChange}
                    isEditing={isEditing}
                  />
                  <BinocularTestInput
                    name="monocularTests.ocularMotilityDuction.os"
                    label="OS"
                    value={getNestedValue(
                      basicBinocularTestsData,
                      "monocularTests.ocularMotilityDuction.os"
                    )}
                    onChange={handleBinocularTestsChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BinocularTestsTab;
