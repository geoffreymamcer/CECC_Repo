import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiActivity } from "react-icons/fi";
import instance from "../../api/axios";

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

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
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
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full ${
                latest.accuracy >= 90 ? "bg-green-500" : "bg-yellow-500"
              }`}
              style={{ width: `${latest.accuracy}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            Last test: {new Date(latest.testDate).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4 relative z-10">
          No vision test records yet.
        </p>
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
