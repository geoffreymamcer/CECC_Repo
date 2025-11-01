import React from "react";
import { FaClipboardList } from "react-icons/fa";

// Helper to safely get nested values from the data object
const getNestedValue = (obj, path) => {
  if (!obj || !path) return "";
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Reusable input component for this tab
const PlanOfManagementInput = ({
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

// Reusable checkbox component for this tab
const PlanOfManagementCheckbox = ({
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

const PlanOfManagementTab = ({
  isEditing,
  planOfManagementData,
  handlePlanOfManagementChange,
}) => {
  const isPlanOfManagementEmpty =
    !planOfManagementData ||
    Object.values(planOfManagementData).every((section) => {
      if (typeof section === "object" && section !== null) {
        // Check if all nested properties are empty
        return Object.values(section).every((value) => {
          if (typeof value === "object" && value !== null) {
            return Object.values(value).every((subValue) => !subValue);
          }
          return !value;
        });
      }
      return !section;
    });

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <FaClipboardList className="mr-2 text-deep-red" />
        Plan of Management
      </h4>
      {isPlanOfManagementEmpty && !isEditing ? (
        <div className="text-center py-4">
          <p className="text-gray-500 italic">
            No plan of management records found for this patient.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Slit Lamp Management */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Slit Lamp Management
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlanOfManagementInput
                name="slitLampManagement.od"
                label="OD"
                value={getNestedValue(
                  planOfManagementData,
                  "slitLampManagement.od"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="slitLampManagement.os"
                label="OS"
                value={getNestedValue(
                  planOfManagementData,
                  "slitLampManagement.os"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Optical Management */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Optical Management
            </h5>
            {/* Final Rx */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h6 className="font-medium text-gray-700 mb-2">
                  Final Rx (OD)
                </h6>
                <div className="grid grid-cols-2 gap-x-4">
                  {[
                    "sphere",
                    "cylinder",
                    "axis",
                    "add",
                    "prism",
                    "base",
                    "mrp",
                    "ipd",
                    "vh",
                    "panto",
                    "wrap",
                  ].map((field) => (
                    <PlanOfManagementInput
                      key={field}
                      name={`opticalManagement.finalRx.od.${field}`}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={getNestedValue(
                        planOfManagementData,
                        `opticalManagement.finalRx.od.${field}`
                      )}
                      onChange={handlePlanOfManagementChange}
                      isEditing={isEditing}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h6 className="font-medium text-gray-700 mb-2">
                  Final Rx (OS)
                </h6>
                <div className="grid grid-cols-2 gap-x-4">
                  {[
                    "sphere",
                    "cylinder",
                    "axis",
                    "add",
                    "prism",
                    "base",
                    "mrp",
                    "ipd",
                    "vh",
                    "panto",
                    "wrap",
                  ].map((field) => (
                    <PlanOfManagementInput
                      key={field}
                      name={`opticalManagement.finalRx.os.${field}`}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={getNestedValue(
                        planOfManagementData,
                        `opticalManagement.finalRx.os.${field}`
                      )}
                      onChange={handlePlanOfManagementChange}
                      isEditing={isEditing}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Other Optical Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <PlanOfManagementInput
                name="opticalManagement.materials"
                label="Materials"
                value={getNestedValue(
                  planOfManagementData,
                  "opticalManagement.materials"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="opticalManagement.coating"
                label="Coating"
                value={getNestedValue(
                  planOfManagementData,
                  "opticalManagement.coating"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="opticalManagement.tint"
                label="Tint"
                value={getNestedValue(
                  planOfManagementData,
                  "opticalManagement.tint"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="opticalManagement.design"
                label="Design"
                value={getNestedValue(
                  planOfManagementData,
                  "opticalManagement.design"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="opticalManagement.frames"
                label="Frames"
                value={getNestedValue(
                  planOfManagementData,
                  "opticalManagement.frames"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
            </div>
            {/* Frame Measurements */}
            <h6 className="font-medium text-gray-700 mb-2">
              Frame Measurements
            </h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {["a", "b", "ed", "dbl"].map((field) => (
                <PlanOfManagementInput
                  key={field}
                  name={`opticalManagement.frameMeasurements.${field}`}
                  label={field.toUpperCase()}
                  value={getNestedValue(
                    planOfManagementData,
                    `opticalManagement.frameMeasurements.${field}`
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
              ))}
            </div>
            <PlanOfManagementInput
              name="opticalManagement.glazingInstruction"
              label="Glazing Instruction"
              value={getNestedValue(
                planOfManagementData,
                "opticalManagement.glazingInstruction"
              )}
              onChange={handlePlanOfManagementChange}
              isEditing={isEditing}
            />
          </div>

          {/* Contact Lens Management */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Contact Lens Management
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h6 className="font-medium text-gray-700 mb-2">
                  Final Rx (OD)
                </h6>
                <div className="grid grid-cols-2 gap-x-4">
                  {[
                    "sphere",
                    "cylinder",
                    "axis",
                    "bc",
                    "dia",
                    "ozd",
                    "sc",
                    "pc",
                    "ct",
                    "material",
                    "tint",
                  ].map((field) => (
                    <PlanOfManagementInput
                      key={field}
                      name={`contactLensManagement.finalRx.od.${field}`}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={getNestedValue(
                        planOfManagementData,
                        `contactLensManagement.finalRx.od.${field}`
                      )}
                      onChange={handlePlanOfManagementChange}
                      isEditing={isEditing}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h6 className="font-medium text-gray-700 mb-2">
                  Final Rx (OS)
                </h6>
                <div className="grid grid-cols-2 gap-x-4">
                  {[
                    "sphere",
                    "cylinder",
                    "axis",
                    "bc",
                    "dia",
                    "ozd",
                    "sc",
                    "pc",
                    "ct",
                    "material",
                    "tint",
                  ].map((field) => (
                    <PlanOfManagementInput
                      key={field}
                      name={`contactLensManagement.finalRx.os.${field}`}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={getNestedValue(
                        planOfManagementData,
                        `contactLensManagement.finalRx.os.${field}`
                      )}
                      onChange={handlePlanOfManagementChange}
                      isEditing={isEditing}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanOfManagementInput
                name="contactLensManagement.design"
                label="Design"
                value={getNestedValue(
                  planOfManagementData,
                  "contactLensManagement.design"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="contactLensManagement.brand"
                label="Brand"
                value={getNestedValue(
                  planOfManagementData,
                  "contactLensManagement.brand"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="contactLensManagement.others"
                label="Others"
                value={getNestedValue(
                  planOfManagementData,
                  "contactLensManagement.others"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Eye Care Solutions */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Eye Care Solutions
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <PlanOfManagementInput
                name="eyeCareSolutions.lubricant"
                label="Lubricant"
                value={getNestedValue(
                  planOfManagementData,
                  "eyeCareSolutions.lubricant"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="eyeCareSolutions.contactLensSolutions"
                label="Contact Lens Solutions"
                value={getNestedValue(
                  planOfManagementData,
                  "eyeCareSolutions.contactLensSolutions"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="eyeCareSolutions.eyeVitamins"
                label="Eye Vitamins"
                value={getNestedValue(
                  planOfManagementData,
                  "eyeCareSolutions.eyeVitamins"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="eyeCareSolutions.lidWipes"
                label="Lid Wipes"
                value={getNestedValue(
                  planOfManagementData,
                  "eyeCareSolutions.lidWipes"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="eyeCareSolutions.warmColdCompress"
                label="Warm/Cold Compress"
                value={getNestedValue(
                  planOfManagementData,
                  "eyeCareSolutions.warmColdCompress"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Therapy & Ocular Hygiene */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">Therapy</h5>
              <PlanOfManagementInput
                name="therapy.amblyopia"
                label="Amblyopia"
                value={getNestedValue(
                  planOfManagementData,
                  "therapy.amblyopia"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <div className="my-2">
                <p className="text-sm text-gray-600 mb-1">Patching</p>
                <div className="flex space-x-4">
                  <PlanOfManagementCheckbox
                    name="therapy.patching.patchREye"
                    label="Patch Right Eye"
                    checked={getNestedValue(
                      planOfManagementData,
                      "therapy.patching.patchREye"
                    )}
                    onChange={handlePlanOfManagementChange}
                    isEditing={isEditing}
                  />
                  <PlanOfManagementCheckbox
                    name="therapy.patching.patchLEye"
                    label="Patch Left Eye"
                    checked={getNestedValue(
                      planOfManagementData,
                      "therapy.patching.patchLEye"
                    )}
                    onChange={handlePlanOfManagementChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
              <PlanOfManagementInput
                name="therapy.time"
                label="Time"
                value={getNestedValue(planOfManagementData, "therapy.time")}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="therapy.others"
                label="Others"
                value={getNestedValue(planOfManagementData, "therapy.others")}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
            </div>
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Ocular Hygiene
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PlanOfManagementCheckbox
                  name="ocularHygiene.increaseOutdoorActivities"
                  label="Increase Outdoor Activities"
                  checked={getNestedValue(
                    planOfManagementData,
                    "ocularHygiene.increaseOutdoorActivities"
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
                <PlanOfManagementCheckbox
                  name="ocularHygiene.stopDigitalDevices"
                  label="Stop Digital Devices"
                  checked={getNestedValue(
                    planOfManagementData,
                    "ocularHygiene.stopDigitalDevices"
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
                <PlanOfManagementCheckbox
                  name="ocularHygiene.activityCharts"
                  label="Activity Charts"
                  checked={getNestedValue(
                    planOfManagementData,
                    "ocularHygiene.activityCharts"
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
                <PlanOfManagementCheckbox
                  name="ocularHygiene.visionBreaks"
                  label="Vision Breaks"
                  checked={getNestedValue(
                    planOfManagementData,
                    "ocularHygiene.visionBreaks"
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
                <PlanOfManagementCheckbox
                  name="ocularHygiene.sunExposure"
                  label="Sun Exposure"
                  checked={getNestedValue(
                    planOfManagementData,
                    "ocularHygiene.sunExposure"
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
                <PlanOfManagementCheckbox
                  name="ocularHygiene.humidityControl"
                  label="Humidity Control"
                  checked={getNestedValue(
                    planOfManagementData,
                    "ocularHygiene.humidityControl"
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
                <PlanOfManagementCheckbox
                  name="ocularHygiene.readingDistance"
                  label="Reading Distance"
                  checked={getNestedValue(
                    planOfManagementData,
                    "ocularHygiene.readingDistance"
                  )}
                  onChange={handlePlanOfManagementChange}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </div>

          {/* Referral and Follow-up */}
          <div className="p-4 border rounded-lg">
            <h5 className="font-semibold mb-3 text-gray-700">
              Referral and Follow-up
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlanOfManagementInput
                name="referralAndFollowUp.referralTo"
                label="Referral To"
                value={getNestedValue(
                  planOfManagementData,
                  "referralAndFollowUp.referralTo"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="referralAndFollowUp.purpose"
                label="Purpose"
                value={getNestedValue(
                  planOfManagementData,
                  "referralAndFollowUp.purpose"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
              <PlanOfManagementInput
                name="referralAndFollowUp.nextAppointment"
                label="Next Appointment"
                value={getNestedValue(
                  planOfManagementData,
                  "referralAndFollowUp.nextAppointment"
                )}
                onChange={handlePlanOfManagementChange}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanOfManagementTab;
