import { useState, useEffect } from "react";
import instance from "../../api/axios";
import { FaDownload, FaSpinner, FaEye } from "react-icons/fa";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState("visit-history");
  const [invoices, setInvoices] = useState([]);
  const [visits, setVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitsError, setVisitsError] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [medicalHistoryLoading, setMedicalHistoryLoading] = useState(false);
  const [medicalHistoryError, setMedicalHistoryError] = useState(null);
  const [visitReports, setVisitReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "visit-history", label: "Visit History" },
    { id: "test-results", label: "Test Results" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "health-history", label: "Health History" },
    { id: "receipts", label: "Receipts" },
  ];

  // Fetch invoices when component mounts
  useEffect(() => {
    const fetchAllRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all necessary data in parallel
        const [invoicesRes, visitsRes, medicalHistoryRes] = await Promise.all([
          instance.get("/invoices/patient").catch((err) => ({ error: err })), // Fetches invoices for logged-in user
          instance.get("/visits/my-visits").catch((err) => ({ error: err })), // Fetches visits for logged-in user
          instance.get("/medicalhistory/me").catch((err) => ({ error: err })), // Fetches medical history for logged-in user
        ]);

        // Check for errors in each response
        if (invoicesRes.error) throw new Error("Could not load receipts.");
        if (visitsRes.error) throw new Error("Could not load visit history.");
        if (
          medicalHistoryRes.error &&
          medicalHistoryRes.error.response?.status !== 404
        ) {
          throw new Error("Could not load health history.");
        }

        setInvoices(invoicesRes.data || []);

        // The same visit data is used for "Visit History" and "Test Results"
        const allVisits = visitsRes.data || [];
        allVisits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
        setVisits(allVisits);

        setMedicalHistory(medicalHistoryRes.data || null);
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setError(err.message || "Failed to load records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecords();
  }, []);

  const handlePdfAction = async (type, visitId) => {
    if (downloadingId) return;
    setDownloadingId(visitId); // Use visitId as the loading key
    try {
      // --- MODIFIED --- Construct the correct, secure patient-facing URL
      const endpoint = `/visits/my-visits/${visitId}/pdf/${type}`;

      const response = await instance.get(endpoint, { responseType: "blob" });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      if (type === "view") {
        window.open(fileURL, "_blank");
      } else {
        // download
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `clinic-report-${visitId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileURL);
      }
    } catch (err) {
      console.error(`Error ${type}ing PDF:`, err);
      alert(`Failed to ${type} PDF. Please try again later.`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Medical Records
      </h3>
      <div className="border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li key={tab.id} className="mr-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? "border-dark-red text-dark-red"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        {activeTab === "prescriptions" && (
          <div className="p-4 rounded-lg bg-gray-50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">
                Current Prescription
              </h4>
              <button className="px-3 py-1 bg-dark-red text-white text-sm rounded hover:bg-deep-red transition-all duration-200 transform hover:scale-[1.02]">
                Download
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border p-3 rounded hover:shadow transition">
                <p className="text-gray-600 text-sm">Right Eye</p>
                <p className="font-medium">
                  SPH: -2.50 | CYL: -1.00 | Axis: 180
                </p>
              </div>
              <div className="border p-3 rounded hover:shadow transition">
                <p className="text-gray-600 text-sm">Left Eye</p>
                <p className="font-medium">
                  SPH: -2.75 | CYL: -0.75 | Axis: 170
                </p>
              </div>
              <div className="border p-3 rounded hover:shadow transition">
                <p className="text-gray-600 text-sm">Additional Notes</p>
                <p className="font-medium">Progressive lenses recommended</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "test-results" && (
          <div className="p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-4">
              Your Visit Reports
            </h4>
            {loading ? (
              <p>Loading reports...</p>
            ) : visits.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No reports found.
              </p>
            ) : (
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div
                    key={visit._id}
                    className="border p-4 rounded bg-white hover:shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-dark-red">
                          Clinical Report
                        </p>
                        <p className="text-sm text-gray-600">
                          Visit Date: {formatDate(visit.visitDate)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {/* --- MODIFIED --- Pass only the visit._id to the handler */}
                        <button
                          onClick={() => handlePdfAction("view", visit._id)}
                          disabled={downloadingId === visit._id}
                          className="px-3 py-1 text-sm border border-dark-red text-dark-red rounded hover:bg-red-50 flex items-center disabled:opacity-50"
                        >
                          {downloadingId === visit._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                        <button
                          onClick={() => handlePdfAction("download", visit._id)}
                          disabled={downloadingId === visit._id}
                          className="px-3 py-1 text-sm bg-dark-red text-white rounded hover:bg-deep-red flex items-center disabled:opacity-50"
                        >
                          {downloadingId === visit._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaDownload />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "health-history" && (
          <div className="p-4 rounded-lg bg-gray-50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">Health History</h4>
              <button className="px-3 py-1 bg-dark-red text-white text-sm rounded hover:bg-deep-red transition-all duration-200 transform hover:scale-[1.02]">
                Download PDF
              </button>
            </div>

            {medicalHistoryLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-red mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading medical history...</p>
              </div>
            ) : medicalHistoryError ? (
              <div className="text-red-600 p-4 text-center">
                {medicalHistoryError}
              </div>
            ) : !medicalHistory ? (
              <div className="text-gray-600 text-center py-4">
                No medical history found. You can add one in your profile.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">
                    Conditions / Ocular History
                  </h5>
                  <p className="text-gray-700">
                    {medicalHistory.ocularHistory || "-"}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Health History</h5>
                  <p className="text-gray-700">
                    {medicalHistory.healthHistory || "-"}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Family Medical History</h5>
                  <p className="text-gray-700">
                    {medicalHistory.familyMedicalHistory || "-"}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Medications</h5>
                  <p className="text-gray-700">
                    {medicalHistory.medications || "-"}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Allergies</h5>
                  <p className="text-gray-700">
                    {medicalHistory.allergies || "-"}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Occupational History</h5>
                  <p className="text-gray-700">
                    {medicalHistory.occupationalHistory || "-"}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Digital History</h5>
                  <p className="text-gray-700">
                    {medicalHistory.digitalHistory || "-"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === "receipts" && (
          <div className="p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-4">
              Invoices & Receipts
            </h4>
            {loading ? (
              <p>Loading invoices...</p>
            ) : invoices.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No invoices found.
              </p>
            ) : (
              <ul className="space-y-3">
                {invoices.map((invoice) => (
                  <li
                    key={invoice._id}
                    className="border p-4 rounded bg-white hover:shadow"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          Invoice #{invoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Job Order: {invoice.jobOrderNumber}
                        </p>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        PHP {invoice.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() =>
                          handlePdfAction(
                            "view",
                            `/invoices/${invoice._id}/pdf/view`
                          )
                        }
                        className="px-3 py-1 text-sm bg-dark-red text-white rounded hover:bg-deep-red"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() =>
                          handlePdfAction(
                            "download",
                            `/invoices/${invoice._id}/pdf/download`
                          )
                        }
                        className="px-3 py-1 text-sm border border-dark-red text-dark-red rounded hover:bg-red-50"
                      >
                        Download PDF
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "visit-history" && (
          <div className="p-4 rounded-lg bg-gray-50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">Visit History</h4>
              <button className="px-3 py-1 bg-dark-red text-white text-sm rounded hover:bg-deep-red transition-all duration-200 transform hover:scale-[1.02]">
                Export
              </button>
            </div>

            {visitsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-red mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading visit history...</p>
              </div>
            ) : visitsError ? (
              <div className="text-red-600 p-4 text-center">{visitsError}</div>
            ) : visits.length === 0 ? (
              <div className="text-gray-600 text-center py-4">
                No past visits found.
              </div>
            ) : (
              <ul className="space-y-3">
                {visits.map((visit) => {
                  const apptDate = new Date(visit.appointmentDate);
                  // If appointmentTime was parsed earlier, prefer the combined date-time; otherwise just show date
                  let displayDate = apptDate.toLocaleDateString();
                  if (visit.appointmentTime) {
                    const timeParts = visit.appointmentTime.split(":");
                    if (timeParts.length === 2) {
                      const hours = parseInt(timeParts[0], 10);
                      const minutes = parseInt(timeParts[1], 10);
                      if (!isNaN(hours) && !isNaN(minutes)) {
                        const dt = new Date(apptDate);
                        dt.setHours(hours, minutes, 0, 0);
                        displayDate = dt.toLocaleString();
                      }
                    } else {
                      // fallback: show date and the raw time string
                      displayDate = `${apptDate.toLocaleDateString()} ${
                        visit.appointmentTime
                      }`;
                    }
                  }

                  const statusColor =
                    visit.status === "completed"
                      ? "green"
                      : visit.status === "cancelled"
                      ? "red"
                      : "yellow";

                  return (
                    <li
                      key={visit._id}
                      className="border p-4 rounded hover:shadow transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{visit.serviceType}</p>
                          <p className="text-sm text-gray-600">{displayDate}</p>
                        </div>
                        <span
                          className={`bg-${statusColor}-100 text-${statusColor}-800 text-xs px-2.5 py-0.5 rounded`}
                        >
                          {visit.status}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
