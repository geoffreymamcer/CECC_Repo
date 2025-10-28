// src/components/BasicBinocularVisionTests.jsx
import React from "react";

// Reusing your existing input style for consistency, tailored for table cells
const TableInput = ({ className = "", placeholder = "", ...props }) => (
  <input
    type="text"
    placeholder={placeholder}
    className={`w-full bg-transparent p-2 focus:outline-none focus:bg-red-50 transition-colors text-gray-800 ${className}`}
    {...props}
  />
);

const SectionHeader = ({ title }) => (
  <div className="bg-[#7F0000] text-white font-bold p-2 text-center uppercase text-sm tracking-wider">
    {title}
  </div>
);

const RowLabel = ({ children, className = "" }) => (
  <div
    className={`p-2 font-semibold text-gray-700 flex items-center bg-gray-50 text-sm ${className}`}
  >
    {children}
  </div>
);

const BasicBinocularVisionTests = ({ binocularTests, setBinocularTests }) => {
  // Handler for top-level fields in the 'binocularTests' section
  const handleBinocularChange = (field, value) => {
    setBinocularTests((prev) => ({
      ...prev,
      binocularTests: {
        ...prev.binocularTests,
        [field]: value,
      },
    }));
  };

  // Handler for nested angle estimation fields (e.g., angleEst6m)
  const handleAngleChange = (distance, field, value) => {
    setBinocularTests((prev) => ({
      ...prev,
      binocularTests: {
        ...prev.binocularTests,
        [distance]: {
          ...prev.binocularTests[distance],
          [field]: value,
        },
      },
    }));
  };

  // Handler for nested fields in the 'monocularTests' section
  const handleMonocularChange = (section, eye, value) => {
    setBinocularTests((prev) => ({
      ...prev,
      monocularTests: {
        ...prev.monocularTests,
        [section]: {
          ...prev.monocularTests[section],
          [eye]: value,
        },
      },
    }));
  };

  return (
    <div className="shadow-md rounded-xl overflow-hidden border border-[#7F0000] bg-white font-sans mt-6">
      <h2 className="text-xl font-bold text-center text-[#7F0000] p-4 border-b-2 border-[#7F0000] uppercase">
        Basic Binocular Vision Tests
      </h2>

      {/* --- BINOCULAR TESTS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#7F0000]">
        {/* Header Row */}
        <SectionHeader title="BINOCULAR TESTS" />
        <div className="md:col-span-2">
          <SectionHeader title="OU" />
        </div>

        {/* Standard Rows */}
        <RowLabel>Stereo acuity LANGS</RowLabel>
        <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-[#7F0000] border-dashed md:border-solid">
          <TableInput
            value={binocularTests.binocularTests.stereoAcuityLangs}
            onChange={(e) =>
              handleBinocularChange("stereoAcuityLangs", e.target.value)
            }
          />
        </div>

        <div className="col-span-full border-t border-gray-300"></div>

        <RowLabel>Stereo acuity Circles</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            value={binocularTests.binocularTests.stereoAcuityCircles}
            onChange={(e) =>
              handleBinocularChange("stereoAcuityCircles", e.target.value)
            }
          />
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* Ocular Motility Version - Special Row with Diagram Background */}
        <RowLabel className="h-32 md:h-auto">OCULAR MOTILITY VERSION</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000] relative h-32">
          {/* Background Diagram mimicking the cross arrows */}
          <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center p-4">
            <svg
              viewBox="0 0 300 150"
              className="w-full h-full text-[#7F0000]"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Main cross */}
              <line x1="150" y1="10" x2="150" y2="140" />
              <line x1="10" y1="75" x2="290" y2="75" />
              {/* Diagonals */}
              <line x1="40" y1="20" x2="260" y2="130" />
              <line x1="40" y1="130" x2="260" y2="20" />
              {/* Arrowheads (simplified) */}
              <path d="M 285 70 L 295 75 L 285 80" fill="none" />
              <path d="M 15 70 L 5 75 L 15 80" fill="none" />
              <path d="M 145 15 L 150 5 L 155 15" fill="none" />
              <path d="M 145 135 L 150 145 L 155 135" fill="none" />
            </svg>
          </div>
          <textarea
            className="w-full h-full bg-transparent p-2 resize-none focus:outline-none focus:bg-red-50 transition-colors relative z-10"
            placeholder="Notes on motility..."
            value={binocularTests.binocularTests.ocularMotilityVersion}
            onChange={(e) =>
              handleBinocularChange("ocularMotilityVersion", e.target.value)
            }
          ></textarea>
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* NPC Row */}
        <RowLabel>NPC (cm) B/R</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            placeholder="Break / Recovery"
            value={binocularTests.binocularTests.npc}
            onChange={(e) => handleBinocularChange("npc", e.target.value)}
          />
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* W4L Rows */}
        <RowLabel>W4L 6M</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            value={binocularTests.binocularTests.w4l6m}
            onChange={(e) => handleBinocularChange("w4l6m", e.target.value)}
          />
        </div>
        <div className="col-span-full border-t border-gray-300"></div>
        <RowLabel>W4L 33cm</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            value={binocularTests.binocularTests.w4l33cm}
            onChange={(e) => handleBinocularChange("w4l33cm", e.target.value)}
          />
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* Maddox Wing */}
        <RowLabel>Maddox Wing (w/R)</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            value={binocularTests.binocularTests.maddoxWing}
            onChange={(e) =>
              handleBinocularChange("maddoxWing", e.target.value)
            }
          />
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* CT Rows */}
        <RowLabel>CT 6m s, c gls</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            placeholder="sc / cc"
            value={binocularTests.binocularTests.ct6m}
            onChange={(e) => handleBinocularChange("ct6m", e.target.value)}
          />
        </div>
        <div className="col-span-full border-t border-gray-300"></div>
        <RowLabel>CT 33cm s, c gls</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            placeholder="sc / cc"
            value={binocularTests.binocularTests.ct33cm}
            onChange={(e) => handleBinocularChange("ct33cm", e.target.value)}
          />
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* Angle Est/Meas Complex Rows */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3">
          <RowLabel className="md:border-r border-[#7F0000] h-full">
            Angle Est/Meas 6M s, c
          </RowLabel>
          <div className="md:col-span-2 p-2 flex flex-wrap items-center gap-3 md:border-l-0 border-[#7F0000]">
            {["hirschbergs", "krimsky", "pct"].map((test) => (
              <div key={test} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="border-b border-gray-500 w-12 text-center focus:outline-none focus:border-[#7F0000]"
                  value={binocularTests.binocularTests.angleEst6m[test] || ""}
                  onChange={(e) =>
                    handleAngleChange("angleEst6m", test, e.target.value)
                  }
                />
                <span className="text-sm text-gray-600 capitalize">
                  {test.replace("s", "'s")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-full border-t border-gray-300"></div>

        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3">
          <RowLabel className="md:border-r border-[#7F0000] h-full">
            Angle Est/Meas 33cm s, c
          </RowLabel>
          <div className="md:col-span-2 p-2 flex flex-wrap items-center gap-3 md:border-l-0 border-[#7F0000]">
            {["hirschbergs", "krimsky", "pct"].map((test) => (
              <div key={test} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="border-b border-gray-500 w-12 text-center focus:outline-none focus:border-[#7F0000]"
                  value={binocularTests.binocularTests.angleEst33cm[test] || ""}
                  onChange={(e) =>
                    handleAngleChange("angleEst33cm", test, e.target.value)
                  }
                />
                <span className="text-sm text-gray-600 capitalize">
                  {test.replace("s", "'s")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* Bagolini Rows */}
        <RowLabel>Bagolini 33cm</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            value={binocularTests.binocularTests.bagolini33cm}
            onChange={(e) =>
              handleBinocularChange("bagolini33cm", e.target.value)
            }
          />
        </div>
        <div className="col-span-full border-t border-gray-300"></div>
        <RowLabel>Bagolini 6m</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            value={binocularTests.binocularTests.bagolini6m}
            onChange={(e) =>
              handleBinocularChange("bagolini6m", e.target.value)
            }
          />
        </div>

        <div className="col-span-full border-t border-[#7F0000]"></div>

        {/* Other Tests Row */}
        <RowLabel>Other Tests</RowLabel>
        <div className="md:col-span-2 md:border-l border-[#7F0000]">
          <TableInput
            placeholder="Specify..."
            value={binocularTests.binocularTests.otherTests}
            onChange={(e) =>
              handleBinocularChange("otherTests", e.target.value)
            }
          />
        </div>
      </div>

      {/* --- MONOCULAR TESTS SECTION --- */}
      <div className="h-4 bg-gray-100 border-b border-[#7F0000]"></div>

      <div className="grid grid-cols-3">
        {/* Header Row */}
        <SectionHeader title="MONOCULAR TESTS" />
        <SectionHeader title="OD" />
        <SectionHeader title="OS" />

        {/* NPA Row */}
        <div className="col-span-3 grid grid-cols-3 border-t border-[#7F0000]">
          <RowLabel className="col-span-3 md:col-span-1 border-b md:border-b-0 border-gray-200">
            NPA (Age/AOA) B/R 3 TRIALS
          </RowLabel>
          <div className="border-r border-[#7F0000] md:border-l md:border-r-0">
            <TableInput
              className="text-center"
              placeholder="OD Results"
              value={binocularTests.monocularTests.npa.od}
              onChange={(e) =>
                handleMonocularChange("npa", "od", e.target.value)
              }
            />
          </div>
          <div className="border-l border-[#7F0000]">
            <TableInput
              className="text-center"
              placeholder="OS Results"
              value={binocularTests.monocularTests.npa.os}
              onChange={(e) =>
                handleMonocularChange("npa", "os", e.target.value)
              }
            />
          </div>
        </div>

        {/* Duction Row */}
        <div className="col-span-3 grid grid-cols-3 border-t border-[#7F0000]">
          <RowLabel className="col-span-3 md:col-span-1 border-b md:border-b-0 border-gray-200">
            OCULAR MOTILITY DUCTION
          </RowLabel>
          <div className="border-r border-[#7F0000] md:border-l md:border-r-0">
            <TableInput
              className="text-center"
              placeholder="OD Duction"
              value={binocularTests.monocularTests.ocularMotilityDuction.od}
              onChange={(e) =>
                handleMonocularChange(
                  "ocularMotilityDuction",
                  "od",
                  e.target.value
                )
              }
            />
          </div>
          <div className="border-l border-[#7F0000]">
            <TableInput
              className="text-center"
              placeholder="OS Duction"
              value={binocularTests.monocularTests.ocularMotilityDuction.os}
              onChange={(e) =>
                handleMonocularChange(
                  "ocularMotilityDuction",
                  "os",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicBinocularVisionTests;
