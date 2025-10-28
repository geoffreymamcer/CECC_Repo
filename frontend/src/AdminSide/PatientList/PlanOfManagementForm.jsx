// src/components/PlanOfManagementForm.jsx
import React from "react";

// Helper components are now controlled by passing props down
const TableInput = (props) => (
  <input
    type="text"
    className="w-full min-w-[60px] bg-transparent p-1.5 text-center text-sm focus:outline-none focus:bg-red-50 transition-colors"
    {...props}
  />
);

const LabeledInput = ({
  label,
  placeholder = "",
  className = "",
  ...props
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm text-gray-700 font-medium">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full p-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#7F0000] focus:border-[#7F0000]"
      {...props}
    />
  </div>
);

const UnderlineInput = ({ label, className = "", ...props }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <label className="text-base font-medium text-gray-800 whitespace-nowrap">
      {label}
    </label>
    <input
      type="text"
      className="w-full border-b-2 border-gray-400 focus:border-[#7F0000] outline-none bg-transparent py-1"
      {...props}
    />
  </div>
);

const CheckboxField = ({ label, ...props }) => (
  <label className="flex items-center space-x-3 cursor-pointer">
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-gray-300 text-[#8B0000] focus:ring-[#7F0000]"
      {...props}
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const PlanOfManagementForm = ({ planOfManagement, setPlanOfManagement }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    const nameParts = name.split(".");

    // Use a callback with setPlanOfManagement to ensure we're working with the latest state
    setPlanOfManagement((prev) => {
      // Deep copy to avoid direct mutation
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;
      // Navigate to the parent of the target property
      for (let i = 0; i < nameParts.length - 1; i++) {
        current = current[nameParts[i]];
      }
      // Set the value on the target property
      current[nameParts[nameParts.length - 1]] = val;
      return newState;
    });
  };

  const opticalRxHeaders = [
    "EYE",
    "SPHERE",
    "CYLINDER",
    "AXIS",
    "ADD",
    "PRISM",
    "BASE",
    "MRP",
    "IPD",
    "VH",
    "PANTO",
    "WRAP",
  ];
  const opticalRxFields = [
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
  ];

  const contactLensHeaders = [
    "EYE",
    "SPHERE",
    "CYLINDER",
    "AXIS",
    "BC",
    "DIA",
    "OZD",
    "SC",
    "PC",
    "CT",
    "Material",
    "TINT",
  ];
  const contactLensFields = [
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
  ];

  return (
    <div className="shadow-md rounded-xl p-4 md:p-6 border border-[#7F0000] bg-white mt-6 font-sans">
      <h2 className="text-xl font-bold text-center text-[#7F0000] pb-2 mb-6 border-b-2 border-[#7F0000] uppercase">
        Plan of Management
      </h2>

      <div className="space-y-8">
        {/* Slit-lamp Management */}
        <section>
          <h3 className="text-lg font-semibold text-[#7F0000] mb-4">
            Slit-lamp Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <UnderlineInput
              label="OD:"
              name="slitLampManagement.od"
              value={planOfManagement.slitLampManagement.od}
              onChange={handleChange}
            />
            <UnderlineInput
              label="OS:"
              name="slitLampManagement.os"
              value={planOfManagement.slitLampManagement.os}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Optical Management (Final Rx) */}
        <section>
          <h3 className="text-lg font-semibold text-[#7F0000] mb-3">
            Optical Management (Final Rx)
          </h3>
          <div className="overflow-x-auto border border-[#7F0000] rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {opticalRxHeaders.map((header) => (
                    <th
                      key={header}
                      className="p-2 font-semibold text-gray-600 border border-gray-200 whitespace-nowrap text-xs"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-2 font-semibold text-center border border-gray-200">
                    OD
                  </td>
                  {opticalRxFields.map((field, i) => (
                    <td key={`od-${i}`} className="border border-gray-200">
                      <TableInput
                        name={`opticalManagement.finalRx.od.${field}`}
                        value={
                          planOfManagement.opticalManagement.finalRx.od[field]
                        }
                        onChange={handleChange}
                      />
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 font-semibold text-center border border-gray-200">
                    OS
                  </td>
                  {opticalRxFields.map((field, i) => (
                    <td key={`os-${i}`} className="border border-gray-200">
                      <TableInput
                        name={`opticalManagement.finalRx.os.${field}`}
                        value={
                          planOfManagement.opticalManagement.finalRx.os[field]
                        }
                        onChange={handleChange}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            <LabeledInput
              label="Materials:"
              name="opticalManagement.materials"
              value={planOfManagement.opticalManagement.materials}
              onChange={handleChange}
            />
            <LabeledInput
              label="Coating:"
              name="opticalManagement.coating"
              value={planOfManagement.opticalManagement.coating}
              onChange={handleChange}
            />
            <LabeledInput
              label="Tint:"
              name="opticalManagement.tint"
              value={planOfManagement.opticalManagement.tint}
              onChange={handleChange}
            />
            <LabeledInput
              label="Design:"
              name="opticalManagement.design"
              value={planOfManagement.opticalManagement.design}
              onChange={handleChange}
            />
            <LabeledInput
              label="Frames:"
              name="opticalManagement.frames"
              value={planOfManagement.opticalManagement.frames}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 items-end">
            <div className="md:col-span-3">
              <label className="text-sm text-gray-700 font-medium">
                Frames
              </label>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-mono">A</span>
                  <input
                    type="text"
                    name="opticalManagement.frameMeasurements.a"
                    value={
                      planOfManagement.opticalManagement.frameMeasurements.a
                    }
                    onChange={handleChange}
                    className="w-16 p-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-mono">B</span>
                  <input
                    type="text"
                    name="opticalManagement.frameMeasurements.b"
                    value={
                      planOfManagement.opticalManagement.frameMeasurements.b
                    }
                    onChange={handleChange}
                    className="w-16 p-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-mono">ED</span>
                  <input
                    type="text"
                    name="opticalManagement.frameMeasurements.ed"
                    value={
                      planOfManagement.opticalManagement.frameMeasurements.ed
                    }
                    onChange={handleChange}
                    className="w-16 p-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-mono">DBL</span>
                  <input
                    type="text"
                    name="opticalManagement.frameMeasurements.dbl"
                    value={
                      planOfManagement.opticalManagement.frameMeasurements.dbl
                    }
                    onChange={handleChange}
                    className="w-16 p-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <LabeledInput
                label="Glazing Instruction:"
                name="opticalManagement.glazingInstruction"
                value={planOfManagement.opticalManagement.glazingInstruction}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Contact Lens Management */}
        <section>
          <h3 className="text-lg font-semibold text-[#7F0000] mb-3">
            Contact Lens Management
          </h3>
          <div className="overflow-x-auto border border-[#7F0000] rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {contactLensHeaders.map((header) => (
                    <th
                      key={header}
                      className="p-2 font-semibold text-gray-600 border border-gray-200 whitespace-nowrap text-xs"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-2 font-semibold text-center border border-gray-200">
                    OD
                  </td>
                  {contactLensFields.map((field, i) => (
                    <td key={`cl-od-${i}`} className="border border-gray-200">
                      <TableInput
                        name={`contactLensManagement.finalRx.od.${field}`}
                        value={
                          planOfManagement.contactLensManagement.finalRx.od[
                            field
                          ]
                        }
                        onChange={handleChange}
                      />
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 font-semibold text-center border border-gray-200">
                    OS
                  </td>
                  {contactLensFields.map((field, i) => (
                    <td key={`cl-os-${i}`} className="border border-gray-200">
                      <TableInput
                        name={`contactLensManagement.finalRx.os.${field}`}
                        value={
                          planOfManagement.contactLensManagement.finalRx.os[
                            field
                          ]
                        }
                        onChange={handleChange}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <LabeledInput
              label="Design:"
              name="contactLensManagement.design"
              value={planOfManagement.contactLensManagement.design}
              onChange={handleChange}
            />
            <LabeledInput
              label="Brand:"
              name="contactLensManagement.brand"
              value={planOfManagement.contactLensManagement.brand}
              onChange={handleChange}
            />
            <LabeledInput
              label="Others:"
              name="contactLensManagement.others"
              value={planOfManagement.contactLensManagement.others}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Eye Care Solutions & Therapy */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-[#7F0000] pt-6">
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-800">
              Eye Care Solutions
            </h4>
            <LabeledInput
              label="Lubricant:"
              name="eyeCareSolutions.lubricant"
              value={planOfManagement.eyeCareSolutions.lubricant}
              onChange={handleChange}
            />
            <LabeledInput
              label="Contact Lens Solutions:"
              name="eyeCareSolutions.contactLensSolutions"
              value={planOfManagement.eyeCareSolutions.contactLensSolutions}
              onChange={handleChange}
            />
            <LabeledInput
              label="Eye Vitamins:"
              name="eyeCareSolutions.eyeVitamins"
              value={planOfManagement.eyeCareSolutions.eyeVitamins}
              onChange={handleChange}
            />
            <LabeledInput
              label="Lid wipes:"
              name="eyeCareSolutions.lidWipes"
              value={planOfManagement.eyeCareSolutions.lidWipes}
              onChange={handleChange}
            />
            <LabeledInput
              label="Warm/Cold Compress:"
              name="eyeCareSolutions.warmColdCompress"
              value={planOfManagement.eyeCareSolutions.warmColdCompress}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-800">Therapy</h4>
            <LabeledInput
              label="Amblyopia:"
              name="therapy.amblyopia"
              value={planOfManagement.therapy.amblyopia}
              onChange={handleChange}
            />
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Patching:
              </label>
              <div className="flex items-center space-x-6 mt-2">
                <CheckboxField
                  label="Patch R Eye"
                  name="therapy.patching.patchREye"
                  checked={planOfManagement.therapy.patching.patchREye}
                  onChange={handleChange}
                />
                <CheckboxField
                  label="Patch L Eye"
                  name="therapy.patching.patchLEye"
                  checked={planOfManagement.therapy.patching.patchLEye}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium">Time:</label>
              <div className="flex items-center space-x-6 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="therapy.time"
                    value="2 hours"
                    checked={planOfManagement.therapy.time === "2 hours"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#8B0000] focus:ring-[#7F0000]"
                  />
                  <span className="text-sm">2 hours</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="therapy.time"
                    value="4 hours"
                    checked={planOfManagement.therapy.time === "4 hours"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#8B0000] focus:ring-[#7F0000]"
                  />
                  <span className="text-sm">4 hours</span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Others:
              </label>
              <textarea
                name="therapy.others"
                value={planOfManagement.therapy.others}
                onChange={handleChange}
                className="w-full mt-1 p-1.5 border border-gray-300 rounded-md text-sm h-20 focus:ring-1 focus:ring-[#7F0000] focus:border-[#7F0000]"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Ocular Hygiene */}
        <section>
          <h3 className="text-md font-semibold text-[#7F0000]">
            Ocular Hygiene (Myopia Control / Dry Eye Management / Ocular
            Fatigue)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mt-4">
            <CheckboxField
              label="Increase outdoor activities"
              name="ocularHygiene.increaseOutdoorActivities"
              checked={planOfManagement.ocularHygiene.increaseOutdoorActivities}
              onChange={handleChange}
            />
            <CheckboxField
              label="Stop Digital Devices"
              name="ocularHygiene.stopDigitalDevices"
              checked={planOfManagement.ocularHygiene.stopDigitalDevices}
              onChange={handleChange}
            />
            <CheckboxField
              label="Activity charts for DD Detox and Replacement Therapy"
              name="ocularHygiene.activityCharts"
              checked={planOfManagement.ocularHygiene.activityCharts}
              onChange={handleChange}
            />
            <CheckboxField
              label="Vision Breaks; Eye Exercise Reminder"
              name="ocularHygiene.visionBreaks"
              checked={planOfManagement.ocularHygiene.visionBreaks}
              onChange={handleChange}
            />
            <CheckboxField
              label="Sun Exposure"
              name="ocularHygiene.sunExposure"
              checked={planOfManagement.ocularHygiene.sunExposure}
              onChange={handleChange}
            />
            <CheckboxField
              label="Humidity Control"
              name="ocularHygiene.humidityControl"
              checked={planOfManagement.ocularHygiene.humidityControl}
              onChange={handleChange}
            />
            <CheckboxField
              label="Reading Distance"
              name="ocularHygiene.readingDistance"
              checked={planOfManagement.ocularHygiene.readingDistance}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Referral & Follow-up */}
        <section className="border-t border-[#7F0000] pt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <UnderlineInput
              label="Referral to:"
              name="referralAndFollowUp.referralTo"
              value={planOfManagement.referralAndFollowUp.referralTo}
              onChange={handleChange}
            />
            <UnderlineInput
              label="Purpose:"
              name="referralAndFollowUp.purpose"
              value={planOfManagement.referralAndFollowUp.purpose}
              onChange={handleChange}
            />
          </div>
          <div>
            <UnderlineInput
              label="Next Appointment/Follow-up:"
              name="referralAndFollowUp.nextAppointment"
              value={planOfManagement.referralAndFollowUp.nextAppointment}
              onChange={handleChange}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlanOfManagementForm;
