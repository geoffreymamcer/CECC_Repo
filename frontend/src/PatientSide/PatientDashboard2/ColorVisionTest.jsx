import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 👇 🤖 EMOJI: ADDED - FiClipboard for the recommendation icon
import { FiEye, FiActivity, FiClipboard } from "react-icons/fi";
// 👆 🤖 EMOJI: END CHANGE
import instance from "../../api/axios";

// 👇 🤖 EMOJI: ADDED - Helper map for readable test names
const TEST_LABELS = {
  ishihara: "Ishihara",
  farnsworth: "Farnsworth D-15",
  anomaloscope: "Anomaloscope",
  lantern: "Lantern Test",
  colorimetry: "Colorimetry",
};
// 👆 🤖 EMOJI: END CHANGE

const ColorVisionTest = () => {
  const navigate = useNavigate();
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    instance
      .get("/colorvisiontest")
      .then((res) => {
        if (res.data && res.data.length > 0) setLatest(res.data[0]);
      })
      .catch(console.error);
  }, []);

  // 👇 🤖 EMOJI: ADDED - Logic to extract true values from followUpTests object
  const getRecommendedTests = (followUpTests) => {
    if (!followUpTests) return [];
    return Object.entries(followUpTests)
      .filter(([key, isRecommended]) => isRecommended === true)
      .map(([key]) => TEST_LABELS[key] || key);
  };

  const recommendations = latest
    ? getRecommendedTests(latest.followUpTests)
    : [];
  // 👆 🤖 EMOJI: END CHANGE

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <FiEye size={80} />
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
        Vision Health
      </h3>

      {latest ? (
        <div className="relative z-10">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-extrabold text-gray-900">
              {Math.round(latest.accuracy)}%
            </span>
            <span className="text-sm font-medium text-gray-500 mb-1">
              Accuracy
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full ${
                latest.accuracy >= 90 ? "bg-green-500" : "bg-yellow-500"
              }`}
              style={{ width: `${latest.accuracy}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Last test: {new Date(latest.testDate).toLocaleDateString()}
          </p>

          {/* 👇 🤖 EMOJI: ADDED - Doctor Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="bg-[#7F0000]/5 border border-[#7F0000]/10 rounded-xl p-3 mb-2 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <FiClipboard className="text-[#7F0000] text-xs" />
                <span className="text-[10px] font-bold text-[#7F0000] uppercase tracking-wider">
                  Doctor Recommends
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recommendations.map((testName, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-semibold text-gray-700 shadow-sm"
                  >
                    {testName}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* 👆 🤖 EMOJI: END CHANGE */}
        </div>
      ) : (
        <div className="relative z-10 flex items-center">
          <p className="text-sm text-gray-500 mb-4">
            No vision test records yet.
          </p>
        </div>
      )}

      <button
        onClick={() => navigate("/color-vision-test")}
        className="mt-4 w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-[#7F0000] transition-colors relative z-10 flex items-center justify-center gap-2"
      >
        <FiActivity /> {latest ? "Retake Test" : "Start Test"}
      </button>
    </div>
  );
};

export default ColorVisionTest;
