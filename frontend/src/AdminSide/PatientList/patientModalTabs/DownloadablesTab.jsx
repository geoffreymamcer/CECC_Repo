import React, { useState } from "react";
import {
  FaFilePdf,
  FaDownload,
  FaEye,
  FaSpinner,
  FaPalette, // 1️⃣ Added icon for Color Vision
} from "react-icons/fa";
import instance from "../../../api/axios";

// 2️⃣ Added colorVisionTests to props
const DownloadablesTab = ({ patient, visitList, colorVisionTests = [] }) => {
  // Renamed to generic loadingId
  const [loadingId, setLoadingId] = useState(null);

  // 3️⃣ Refactored handler to support 'source' (visit vs ishihara)
  const handlePdfAction = async (source, type, item) => {
    if (loadingId) return;
    setLoadingId(item._id);

    try {
      let endpoint = "";
      let fileName = "";

      if (source === "visit") {
        // Existing Admin Visit Endpoint
        endpoint = `/visits/admin/${item._id}/pdf/${type}`;
        fileName = `clinic-report-${patient.patientId}-${
          new Date(item.visitDate).toISOString().split("T")[0]
        }.pdf`;
      } else if (source === "ishihara") {
        // Color Vision Endpoint (Same endpoint serves stream, client handles view/download)
        endpoint = `/colorvisiontest/${item._id}/pdf`;
        fileName = `Ishihara_Report_${patient.patientId}_${
          new Date(item.testDate).toISOString().split("T")[0]
        }.pdf`;
      }

      const response = await instance.get(endpoint, {
        responseType: "blob",
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      if (type === "view") {
        window.open(fileURL, "_blank");
      } else {
        // download
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileURL);
      }
    } catch (err) {
      console.error(`Error ${type}ing PDF:`, err);
      alert(
        `Failed to ${type} PDF. You may not have the required permissions.`
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn space-y-8">
      {/* --- SECTION 1: VISIT REPORTS --- */}
      <div>
        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
          <FaFilePdf className="mr-2 text-deep-red" />
          Clinical Visit Reports
        </h4>
        {visitList.length === 0 ? (
          <div className="text-center py-4 text-gray-500 italic bg-white rounded-lg border border-gray-100">
            No visit history found.
          </div>
        ) : (
          <div className="space-y-3">
            {visitList.map((visit) => (
              <div
                key={visit._id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-100"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Visit:{" "}
                    {new Date(visit.visitDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">Dr. {visit.doctor}</p>
                </div>

                <div className="flex items-center space-x-3">
                  {loadingId === visit._id ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <FaSpinner className="animate-spin mr-2" />
                      Generating...
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handlePdfAction("visit", "view", visit)}
                        className="px-3 py-1.5 bg-white text-dark-red border border-dark-red text-xs font-bold rounded hover:bg-red-50 transition-colors flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() =>
                          handlePdfAction("visit", "download", visit)
                        }
                        className="px-3 py-1.5 bg-dark-red text-white text-xs font-bold rounded hover:bg-deep-red transition-colors flex items-center"
                      >
                        <FaDownload className="mr-1" /> Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SECTION 2: ISHIHARA REPORTS (NEW) --- */}
      <div>
        <h4 className="font-bold text-gray-800 mb-4 flex items-center border-t border-gray-200 pt-6">
          <FaPalette className="mr-2 text-deep-red" />
          Ishihara Color Vision Reports
        </h4>

        {colorVisionTests.length === 0 ? (
          <div className="text-center py-4 text-gray-500 italic bg-white rounded-lg border border-gray-100">
            No color vision tests found.
          </div>
        ) : (
          <div className="space-y-3">
            {colorVisionTests.map((test) => (
              <div
                key={test._id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-100"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Test Date:{" "}
                    {new Date(test.testDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Result:{" "}
                    <span className="font-medium text-dark-red">
                      {test.testResult}
                    </span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {loadingId === test._id ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <FaSpinner className="animate-spin mr-2" />
                      Generating...
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handlePdfAction("ishihara", "view", test)
                        }
                        className="px-3 py-1.5 bg-white text-dark-red border border-dark-red text-xs font-bold rounded hover:bg-red-50 transition-colors flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() =>
                          handlePdfAction("ishihara", "download", test)
                        }
                        className="px-3 py-1.5 bg-dark-red text-white text-xs font-bold rounded hover:bg-deep-red transition-colors flex items-center"
                      >
                        <FaDownload className="mr-1" /> Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadablesTab;
