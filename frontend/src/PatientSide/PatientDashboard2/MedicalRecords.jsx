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
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const tabs = [
    { id: "visit-history", label: "Visit History" },
    { id: "test-results", label: "Test Results" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "receipts", label: "Receipts" },
  ];

  // Fetch invoices when component mounts
  useEffect(() => {
    const fetchAllRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all necessary data in parallel
        const [invoicesRes, visitsRes] = await Promise.all([
          instance.get("/invoices/patient").catch((err) => ({ error: err })), // Fetches invoices for logged-in user
          instance.get("/visits/my-visits").catch((err) => ({ error: err })), // Fetches visits for logged-in user
        ]);

        // Check for errors in each response
        if (invoicesRes.error) throw new Error("Could not load receipts.");
        if (visitsRes.error) throw new Error("Could not load visit history.");

        setInvoices(invoicesRes.data || []);

        // The same visit data is used for "Visit History" and "Test Results"
        const allVisits = visitsRes.data || [];
        allVisits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
        setVisits(allVisits);
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setError(err.message || "Failed to load records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecords();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      // No need to fetch if data is already there or if tab is not active
      if (activeTab !== "visit-history" || appointments.length > 0) return;

      setAppointmentsLoading(true);
      setAppointmentsError(null);
      try {
        const response = await instance.get("/appointments/my-appointments");
        const sortedAppointments = (response.data || []).sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setAppointments(sortedAppointments);
      } catch (err) {
        console.error("Error fetching appointment history:", err);
        setAppointmentsError("Failed to load visit history. Please try again.");
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab, appointments.length]);

  // --- REPLACE WITH THIS VERSION ---
  const handlePdfAction = async (type, fullEndpoint, fileName) => {
    if (downloadingId) return;
    setDownloadingId(fullEndpoint); // Use the unique endpoint as the loading key
    try {
      const response = await instance.get(fullEndpoint, {
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
      alert(`Failed to ${type} PDF. Please try again later.`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg flex flex-col h-[600px]">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex-shrink-0">
        Medical Records
      </h3>
      <div className="border-b border-gray-200 flex-shrink-0">
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
      <div className="mt-4 flex-1 overflow-y-auto pr-2">
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
                {visits.map((visit) => {
                  const viewEndpoint = `/visits/my-visits/${visit._id}/pdf/view`;
                  const downloadEndpoint = `/visits/my-visits/${visit._id}/pdf/download`;
                  const fileName = `clinic-report-${
                    new Date(visit.visitDate).toISOString().split("T")[0]
                  }.pdf`;
                  return (
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
                          <button
                            onClick={() =>
                              handlePdfAction("view", viewEndpoint)
                            }
                            disabled={downloadingId === viewEndpoint}
                            className="..."
                          >
                            {downloadingId === viewEndpoint ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaEye />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handlePdfAction(
                                "download",
                                downloadEndpoint,
                                fileName
                              )
                            }
                            disabled={downloadingId === downloadEndpoint}
                            className="..."
                          >
                            {downloadingId === downloadEndpoint ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaDownload />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <div className="text-center py-4 text-gray-500">
                Loading invoices...
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : invoices.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No invoices found.
              </p>
            ) : (
              <ul className="space-y-3">
                {invoices.map((invoice) => {
                  // Define endpoints and filename for clarity
                  const viewEndpoint = `/invoices/${invoice._id}/pdf/view`;
                  const downloadEndpoint = `/invoices/${invoice._id}/pdf/download`;
                  const fileName = `invoice-${invoice.invoiceNumber}.pdf`;

                  return (
                    <li
                      key={invoice._id}
                      className="border p-4 rounded bg-white hover:shadow transition"
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
                          onClick={() => handlePdfAction("view", viewEndpoint)}
                          disabled={
                            downloadingId === viewEndpoint ||
                            downloadingId === downloadEndpoint
                          }
                          className="px-3 py-1 text-sm bg-dark-red text-white rounded hover:bg-deep-red transition-all duration-200 flex items-center justify-center w-28 disabled:bg-gray-400"
                        >
                          {downloadingId === viewEndpoint ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <>
                              <FaEye className="mr-2" /> View
                            </>
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handlePdfAction(
                              "download",
                              downloadEndpoint,
                              fileName
                            )
                          }
                          disabled={
                            downloadingId === viewEndpoint ||
                            downloadingId === downloadEndpoint
                          }
                          className="px-3 py-1 text-sm border border-dark-red text-dark-red rounded hover:bg-red-50 transition-all duration-200 flex items-center justify-center w-32 disabled:opacity-50"
                        >
                          {downloadingId === downloadEndpoint ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <>
                              <FaDownload className="mr-2" /> Download
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        {activeTab === "visit-history" && (
          <div className="p-4 rounded-lg bg-gray-50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">Visit History</h4>
            </div>

            {appointmentsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-red mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading visit history...</p>
              </div>
            ) : appointmentsError ? (
              <div className="text-red-600 p-4 text-center">
                {appointmentsError}
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-gray-600 text-center py-4">
                No past visits found.
              </div>
            ) : (
              <ul className="space-y-3">
                {appointments.map((appointment) => {
                  const apptDate = new Date(appointment.appointmentDate);
                  let displayDate = apptDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  if (appointment.appointmentTime) {
                    // A simple way to format time without full date-time objects
                    displayDate += ` at ${appointment.appointmentTime}`;
                  }

                  const statusColor =
                    appointment.status === "completed"
                      ? "green"
                      : appointment.status === "cancelled"
                      ? "red"
                      : "yellow";

                  return (
                    <li
                      key={appointment._id}
                      className="border p-4 rounded bg-white hover:shadow transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {appointment.serviceType}
                          </p>
                          <p className="text-sm text-gray-600">{displayDate}</p>
                        </div>
                        <span
                          className={`bg-${statusColor}-100 text-${statusColor}-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize`}
                        >
                          {appointment.status}
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
