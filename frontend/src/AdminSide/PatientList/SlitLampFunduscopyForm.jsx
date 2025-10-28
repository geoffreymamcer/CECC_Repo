// src/components/SlitLampFunduscopyForm.jsx
import React from "react";

// Reusable component for form fields for consistency
const FormField = ({ label, value, onChange }) => (
  <div className="flex items-center space-x-2">
    <label className="w-28 text-sm text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="flex-1 w-full border-b-2 border-gray-300 focus:border-[#7F0000] outline-none transition-colors py-1"
    />
  </div>
);

// Component for the complex fundus diagram at the bottom
const FundusDiagram = ({ label }) => (
  <div className="flex flex-col items-center">
    <span className="font-semibold text-gray-700 mb-2">{label}</span>
    <div className="relative w-48 h-48">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        aria-label="Fundus Diagram"
      >
        {/* Outer Circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
        {/* Inner Circle */}
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke="black"
          strokeWidth="0.5"
          fill="none"
        />
        {/* Radial Lines */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
          (angle) => (
            <line
              key={angle}
              x1="50"
              y1="50"
              x2={50 + 48 * Math.cos((angle * Math.PI) / 180)}
              y2={50 + 48 * Math.sin((angle * Math.PI) / 180)}
              stroke="black"
              strokeWidth="0.5"
            />
          )
        )}
        <text
          x="50"
          y="53"
          textAnchor="middle"
          fontSize="10"
          fill="gray"
          fontWeight="bold"
        >
          {label}
        </text>
      </svg>
    </div>
  </div>
);

const SlitLampFunduscopyForm = ({
  slitLampFunduscopy,
  setSlitLampFunduscopy,
}) => {
  const handleChange = (section, eye, field, value) => {
    setSlitLampFunduscopy((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [eye]: {
          ...prev[section][eye],
          [field]: value,
        },
      },
    }));
  };
  return (
    <div className="shadow-md rounded-xl p-4 sm:p-6 border border-[#7F0000] bg-white font-sans mt-6">
      {/* --- Slit-lamp Examination Section --- */}
      <div className="border-t-2 border-[#7F0000] pt-4">
        <h3 className="text-lg font-semibold text-center text-[#7F0000] mb-4">
          Slit-lamp Examination
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* OD Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-center text-gray-800">OD</h4>
            <FormField
              label="Lids/Lashes"
              value={slitLampFunduscopy.slitLamp.od.lidsLashes}
              onChange={(e) =>
                handleChange("slitLamp", "od", "lidsLashes", e.target.value)
              }
            />
            <FormField
              label="Conjunctiva"
              value={slitLampFunduscopy.slitLamp.od.conjunctiva}
              onChange={(e) =>
                handleChange("slitLamp", "od", "conjunctiva", e.target.value)
              }
            />
            <FormField
              label="Sclera"
              value={slitLampFunduscopy.slitLamp.od.sclera}
              onChange={(e) =>
                handleChange("slitLamp", "od", "sclera", e.target.value)
              }
            />
            <FormField
              label="Cornea"
              value={slitLampFunduscopy.slitLamp.od.cornea}
              onChange={(e) =>
                handleChange("slitLamp", "od", "cornea", e.target.value)
              }
            />
            <FormField
              label="AC"
              value={slitLampFunduscopy.slitLamp.od.ac}
              onChange={(e) =>
                handleChange("slitLamp", "od", "ac", e.target.value)
              }
            />
            <FormField
              label="Iris"
              value={slitLampFunduscopy.slitLamp.od.iris}
              onChange={(e) =>
                handleChange("slitLamp", "od", "iris", e.target.value)
              }
            />
            <FormField
              label="Pupil"
              value={slitLampFunduscopy.slitLamp.od.pupil}
              onChange={(e) =>
                handleChange("slitLamp", "od", "pupil", e.target.value)
              }
            />
            <FormField
              label="Lens"
              value={slitLampFunduscopy.slitLamp.od.lens}
              onChange={(e) =>
                handleChange("slitLamp", "od", "lens", e.target.value)
              }
            />
            <FormField
              label="IOP"
              value={slitLampFunduscopy.slitLamp.od.iop}
              onChange={(e) =>
                handleChange("slitLamp", "od", "iop", e.target.value)
              }
            />
            <FormField
              label="Type:"
              value={slitLampFunduscopy.slitLamp.od.iopType}
              onChange={(e) =>
                handleChange("slitLamp", "od", "iopType", e.target.value)
              }
            />
            <FormField
              label="Time:"
              value={slitLampFunduscopy.slitLamp.od.iopTime}
              onChange={(e) =>
                handleChange("slitLamp", "od", "iopTime", e.target.value)
              }
            />
          </div>

          {/* Center Diagrams */}
          <div className="md:col-span-1 flex flex-col items-center justify-around space-y-4">
            <div className="text-center w-full">
              <span className="text-sm font-semibold text-gray-600">
                External Eye
              </span>
              <div className="flex justify-center space-x-2 mt-1">
                <div className="w-12 h-8 border-2 border-gray-400 rounded-full"></div>
                <div className="w-12 h-8 border-2 border-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="text-center w-full">
              <span className="text-sm font-semibold text-gray-600">
                Anterior Segment
              </span>
              <div className="flex justify-center space-x-2 mt-1">
                <div className="w-14 h-14 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs">
                  CxO
                </div>
                <div className="w-14 h-14 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs">
                  CxO
                </div>
              </div>
            </div>
            <div className="text-center w-full">
              <span className="text-sm font-semibold text-gray-600">VHE</span>
              <div className="flex justify-center mt-1">
                <div className="w-14 h-14 border-2 border-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="text-center w-full">
              <span className="text-sm font-semibold text-gray-600">
                Gonioscopy
              </span>
              <div className="flex justify-center space-x-2 mt-1">
                <div className="w-12 h-12 border-2 border-gray-400 rounded-full relative">
                  <span className="absolute inset-0 flex items-center justify-center text-2xl text-gray-400">
                    ×
                  </span>
                </div>
                <div className="w-12 h-12 border-2 border-gray-400 rounded-full relative">
                  <span className="absolute inset-0 flex items-center justify-center text-2xl text-gray-400">
                    ×
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* OS Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-center text-gray-800">OS</h4>
            <FormField
              label="Lids/Lashes"
              value={slitLampFunduscopy.slitLamp.os.lidsLashes}
              onChange={(e) =>
                handleChange("slitLamp", "os", "lidsLashes", e.target.value)
              }
            />
            <FormField
              label="Conjunctiva"
              value={slitLampFunduscopy.slitLamp.os.conjunctiva}
              onChange={(e) =>
                handleChange("slitLamp", "os", "conjunctiva", e.target.value)
              }
            />
            <FormField
              label="Sclera"
              value={slitLampFunduscopy.slitLamp.os.sclera}
              onChange={(e) =>
                handleChange("slitLamp", "os", "sclera", e.target.value)
              }
            />
            <FormField
              label="Cornea"
              value={slitLampFunduscopy.slitLamp.os.cornea}
              onChange={(e) =>
                handleChange("slitLamp", "os", "cornea", e.target.value)
              }
            />
            <FormField
              label="AC"
              value={slitLampFunduscopy.slitLamp.os.ac}
              onChange={(e) =>
                handleChange("slitLamp", "os", "ac", e.target.value)
              }
            />
            <FormField
              label="Iris"
              value={slitLampFunduscopy.slitLamp.os.iris}
              onChange={(e) =>
                handleChange("slitLamp", "os", "iris", e.target.value)
              }
            />
            <FormField
              label="Pupil"
              value={slitLampFunduscopy.slitLamp.os.pupil}
              onChange={(e) =>
                handleChange("slitLamp", "os", "pupil", e.target.value)
              }
            />
            <FormField
              label="Lens"
              value={slitLampFunduscopy.slitLamp.os.lens}
              onChange={(e) =>
                handleChange("slitLamp", "os", "lens", e.target.value)
              }
            />
            <FormField
              label="IOP"
              value={slitLampFunduscopy.slitLamp.os.iop}
              onChange={(e) =>
                handleChange("slitLamp", "os", "iop", e.target.value)
              }
            />
            <FormField
              label="Type:"
              value={slitLampFunduscopy.slitLamp.os.iopType}
              onChange={(e) =>
                handleChange("slitLamp", "os", "iopType", e.target.value)
              }
            />
            <FormField
              label="Time:"
              value={slitLampFunduscopy.slitLamp.os.iopTime}
              onChange={(e) =>
                handleChange("slitLamp", "os", "iopTime", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* --- Funduscopy Section --- */}
      <div className="border-t-2 border-[#7F0000] mt-8 pt-4">
        <h3 className="text-lg font-semibold text-center text-[#7F0000] mb-4">
          Funduscopy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* OD Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-center text-gray-800">OD</h4>
            <FormField
              label="Retina"
              value={slitLampFunduscopy.funduscopy.od.retina}
              onChange={(e) =>
                handleChange("funduscopy", "od", "retina", e.target.value)
              }
            />
            <FormField
              label="Macula"
              value={slitLampFunduscopy.funduscopy.od.macula}
              onChange={(e) =>
                handleChange("funduscopy", "od", "macula", e.target.value)
              }
            />
            <FormField
              label="Vessels"
              value={slitLampFunduscopy.funduscopy.od.vessels}
              onChange={(e) =>
                handleChange("funduscopy", "od", "vessels", e.target.value)
              }
            />
            <FormField
              label="AVR"
              value={slitLampFunduscopy.funduscopy.od.avr}
              onChange={(e) =>
                handleChange("funduscopy", "od", "avr", e.target.value)
              }
            />
            <FormField
              label="Optic Disc"
              value={slitLampFunduscopy.funduscopy.od.opticDisc}
              onChange={(e) =>
                handleChange("funduscopy", "od", "opticDisc", e.target.value)
              }
            />
            <FormField
              label="CDR"
              value={slitLampFunduscopy.funduscopy.od.cdr}
              onChange={(e) =>
                handleChange("funduscopy", "od", "cdr", e.target.value)
              }
            />
            <FormField
              label="Others:"
              value={slitLampFunduscopy.funduscopy.od.others}
              onChange={(e) =>
                handleChange("funduscopy", "od", "others", e.target.value)
              }
            />
          </div>

          {/* Center Placeholders */}
          <div className="md:col-span-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 border-2 border-gray-400 rounded-full"></div>
            <div className="w-24 h-24 border-2 border-gray-400 rounded-full"></div>
          </div>

          {/* OS Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-center text-gray-800">OS</h4>
            <FormField
              label="Retina"
              value={slitLampFunduscopy.funduscopy.os.retina}
              onChange={(e) =>
                handleChange("funduscopy", "os", "retina", e.target.value)
              }
            />
            <FormField
              label="Macula"
              value={slitLampFunduscopy.funduscopy.os.macula}
              onChange={(e) =>
                handleChange("funduscopy", "os", "macula", e.target.value)
              }
            />
            <FormField
              label="Vessels"
              value={slitLampFunduscopy.funduscopy.os.vessels}
              onChange={(e) =>
                handleChange("funduscopy", "os", "vessels", e.target.value)
              }
            />
            <FormField
              label="AVR"
              value={slitLampFunduscopy.funduscopy.os.avr}
              onChange={(e) =>
                handleChange("funduscopy", "os", "avr", e.target.value)
              }
            />
            <FormField
              label="Optic Disc"
              value={slitLampFunduscopy.funduscopy.os.opticDisc}
              onChange={(e) =>
                handleChange("funduscopy", "os", "opticDisc", e.target.value)
              }
            />
            <FormField
              label="CDR"
              value={slitLampFunduscopy.funduscopy.os.cdr}
              onChange={(e) =>
                handleChange("funduscopy", "os", "cdr", e.target.value)
              }
            />
            <FormField
              label="Others:"
              value={slitLampFunduscopy.funduscopy.os.others}
              onChange={(e) =>
                handleChange("funduscopy", "os", "others", e.target.value)
              }
            />
          </div>
        </div>

        {/* Bottom Fundus Diagrams */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 mt-8">
          <FundusDiagram label="OD" />
          <FundusDiagram label="OS" />
        </div>
      </div>
    </div>
  );
};

export default SlitLampFunduscopyForm;
