import React from "react";
import { FaLightbulb } from "react-icons/fa";

// Helper to safely get nested values from the data object
const getNestedValue = (obj, path) => {
  if (!obj || !path) return "";
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

// Reusable input component for this tab
const SlitLampInput = ({
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

const SlitLampTab = ({ isEditing, slitLampData, handleSlitLampChange }) => {
  const isSlitLampEmpty =
    !slitLampData ||
    (Object.keys(slitLampData.slitLamp?.od || {}).every(
      (key) => !slitLampData.slitLamp.od[key]
    ) &&
      Object.keys(slitLampData.slitLamp?.os || {}).every(
        (key) => !slitLampData.slitLamp.os[key]
      ) &&
      Object.keys(slitLampData.funduscopy?.od || {}).every(
        (key) => !slitLampData.funduscopy.od[key]
      ) &&
      Object.keys(slitLampData.funduscopy?.os || {}).every(
        (key) => !slitLampData.funduscopy.os[key]
      ));

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <FaLightbulb className="mr-2 text-deep-red" />
        Slit Lamp & Funduscopy
      </h4>
      {isSlitLampEmpty && !isEditing ? (
        <div className="text-center py-4">
          <p className="text-gray-500 italic">
            No slit lamp or funduscopy records found for this patient.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slit Lamp Examination Section */}
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Slit Lamp Examination
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {/* OD Column */}
                <div>
                  <h6 className="font-medium text-center text-gray-700 mb-2">
                    OD
                  </h6>
                  <SlitLampInput
                    name="slitLamp.od.lidsLashes"
                    label="Lids/Lashes"
                    value={getNestedValue(
                      slitLampData,
                      "slitLamp.od.lidsLashes"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.conjunctiva"
                    label="Conjunctiva"
                    value={getNestedValue(
                      slitLampData,
                      "slitLamp.od.conjunctiva"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.sclera"
                    label="Sclera"
                    value={getNestedValue(slitLampData, "slitLamp.od.sclera")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.cornea"
                    label="Cornea"
                    value={getNestedValue(slitLampData, "slitLamp.od.cornea")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.ac"
                    label="A/C"
                    value={getNestedValue(slitLampData, "slitLamp.od.ac")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.iris"
                    label="Iris"
                    value={getNestedValue(slitLampData, "slitLamp.od.iris")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.pupil"
                    label="Pupil"
                    value={getNestedValue(slitLampData, "slitLamp.od.pupil")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.lens"
                    label="Lens"
                    value={getNestedValue(slitLampData, "slitLamp.od.lens")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.iop"
                    label="IOP"
                    value={getNestedValue(slitLampData, "slitLamp.od.iop")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.iopType"
                    label="IOP Type"
                    value={getNestedValue(slitLampData, "slitLamp.od.iopType")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.od.iopTime"
                    label="IOP Time"
                    value={getNestedValue(slitLampData, "slitLamp.od.iopTime")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                </div>
                {/* OS Column */}
                <div>
                  <h6 className="font-medium text-center text-gray-700 mb-2">
                    OS
                  </h6>
                  <SlitLampInput
                    name="slitLamp.os.lidsLashes"
                    label="Lids/Lashes"
                    value={getNestedValue(
                      slitLampData,
                      "slitLamp.os.lidsLashes"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.conjunctiva"
                    label="Conjunctiva"
                    value={getNestedValue(
                      slitLampData,
                      "slitLamp.os.conjunctiva"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.sclera"
                    label="Sclera"
                    value={getNestedValue(slitLampData, "slitLamp.os.sclera")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.cornea"
                    label="Cornea"
                    value={getNestedValue(slitLampData, "slitLamp.os.cornea")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.ac"
                    label="A/C"
                    value={getNestedValue(slitLampData, "slitLamp.os.ac")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.iris"
                    label="Iris"
                    value={getNestedValue(slitLampData, "slitLamp.os.iris")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.pupil"
                    label="Pupil"
                    value={getNestedValue(slitLampData, "slitLamp.os.pupil")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.lens"
                    label="Lens"
                    value={getNestedValue(slitLampData, "slitLamp.os.lens")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.iop"
                    label="IOP"
                    value={getNestedValue(slitLampData, "slitLamp.os.iop")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.iopType"
                    label="IOP Type"
                    value={getNestedValue(slitLampData, "slitLamp.os.iopType")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="slitLamp.os.iopTime"
                    label="IOP Time"
                    value={getNestedValue(slitLampData, "slitLamp.os.iopTime")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Funduscopy Examination Section */}
            <div className="p-4 border rounded-lg">
              <h5 className="font-semibold mb-3 text-gray-700">
                Funduscopy Examination
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {/* OD Column */}
                <div>
                  <h6 className="font-medium text-center text-gray-700 mb-2">
                    OD
                  </h6>
                  <SlitLampInput
                    name="funduscopy.od.retina"
                    label="Retina"
                    value={getNestedValue(slitLampData, "funduscopy.od.retina")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.od.macula"
                    label="Macula"
                    value={getNestedValue(slitLampData, "funduscopy.od.macula")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.od.vessels"
                    label="Vessels"
                    value={getNestedValue(
                      slitLampData,
                      "funduscopy.od.vessels"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.od.avr"
                    label="A/V-R"
                    value={getNestedValue(slitLampData, "funduscopy.od.avr")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.od.opticDisc"
                    label="Optic Disc"
                    value={getNestedValue(
                      slitLampData,
                      "funduscopy.od.opticDisc"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.od.cdr"
                    label="C/D-R"
                    value={getNestedValue(slitLampData, "funduscopy.od.cdr")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.od.others"
                    label="Others"
                    value={getNestedValue(slitLampData, "funduscopy.od.others")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                </div>
                {/* OS Column */}
                <div>
                  <h6 className="font-medium text-center text-gray-700 mb-2">
                    OS
                  </h6>
                  <SlitLampInput
                    name="funduscopy.os.retina"
                    label="Retina"
                    value={getNestedValue(slitLampData, "funduscopy.os.retina")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.os.macula"
                    label="Macula"
                    value={getNestedValue(slitLampData, "funduscopy.os.macula")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.os.vessels"
                    label="Vessels"
                    value={getNestedValue(
                      slitLampData,
                      "funduscopy.os.vessels"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.os.avr"
                    label="A/V-R"
                    value={getNestedValue(slitLampData, "funduscopy.os.avr")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.os.opticDisc"
                    label="Optic Disc"
                    value={getNestedValue(
                      slitLampData,
                      "funduscopy.os.opticDisc"
                    )}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.os.cdr"
                    label="C/D-R"
                    value={getNestedValue(slitLampData, "funduscopy.os.cdr")}
                    onChange={handleSlitLampChange}
                    isEditing={isEditing}
                  />
                  <SlitLampInput
                    name="funduscopy.os.others"
                    label="Others"
                    value={getNestedValue(slitLampData, "funduscopy.os.others")}
                    onChange={handleSlitLampChange}
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

export default SlitLampTab;
