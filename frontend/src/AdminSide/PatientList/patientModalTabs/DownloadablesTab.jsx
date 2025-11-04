import React, { useState } from "react";
import { FaFilePdf, FaDownload, FaEye, FaSpinner } from "react-icons/fa";
import instance from "../../../api/axios";

const DownloadablesTab = ({ patient, visitList }) => {
  const [loadingVisitId, setLoadingVisitId] = useState(null);

  const handlePdfAction = async (type, visit) => {
    if (loadingVisitId) return;
    setLoadingVisitId(visit._id);
    try {
      // Construct the correct ADMIN endpoint
      const endpoint = `/visits/admin/${visit._id}/pdf/${type}`;

      const response = await api.get(endpoint, {
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
        const fileName = `clinic-report-${patient.patientId}-${
          new Date(visit.visitDate).toISOString().split("T")[0]
        }.pdf`;
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
      setLoadingVisitId(null);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-5 animate-fadeIn">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <FaFilePdf className="mr-2 text-deep-red" />
        Downloadable Visit Reports
      </h4>
      {visitList.length === 0 ? (
        <div className="text-center py-4 text-gray-500 italic">
          No visit history found.
        </div>
      ) : (
        <div className="space-y-3">
          {visitList.map((visit) => (
            <div
              key={visit._id}
              className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Visit on:{" "}
                  {new Date(visit.visitDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500">Doctor: {visit.doctor}</p>
              </div>

              {/* --- NEW --- Two separate buttons for View and Download */}
              <div className="flex items-center space-x-3">
                {loadingVisitId === visit._id && (
                  <div className="flex items-center text-sm text-gray-500">
                    <FaSpinner className="animate-spin mr-2" />
                    Generating...
                  </div>
                )}
                {loadingVisitId !== visit._id && (
                  <>
                    <button
                      onClick={() => handlePdfAction("view", visit)}
                      className="px-4 py-2 bg-white text-dark-red border border-dark-red text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center"
                    >
                      <FaEye className="mr-2" /> View
                    </button>
                    <button
                      onClick={() => handlePdfAction("download", visit)}
                      className="px-4 py-2 bg-dark-red text-white text-sm rounded-lg hover:bg-deep-red transition-colors flex items-center"
                    >
                      <FaDownload className="mr-2" /> Download
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadablesTab;
