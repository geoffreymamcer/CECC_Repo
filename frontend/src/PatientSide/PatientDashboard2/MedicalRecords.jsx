import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import {
  FaDownload,
  FaSpinner,
  FaEye,
  FaFileMedical,
  FaReceipt,
  FaFlask,
  FaHistory,
} from "react-icons/fa";

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

  // Data States
  const [invoices, setInvoices] = useState([]);
  const [visits, setVisits] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [latestRx, setLatestRx] = useState(null);
  const [rxLoading, setRxLoading] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchLatestRx = async () => {
      if (activeTab !== "prescriptions" || latestRx) return;

      setRxLoading(true);
      try {
        const response = await instance.get("/plan-of-management/my-latest");
        setLatestRx(response.data);
      } catch (err) {
        console.warn("No active prescription found or error fetching:", err);
        setLatestRx(null);
      } finally {
        setRxLoading(false);
      }
    };

    fetchLatestRx();
  }, [activeTab, latestRx]);

  useEffect(() => {
    const fetchBaseRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const [invoicesRes, visitsRes] = await Promise.all([
          instance.get("/invoices/patient").catch((err) => ({ error: err })),
          instance.get("/visits/my-visits").catch((err) => ({ error: err })),
        ]);

        if (invoicesRes.error) console.warn("Could not load invoices");
        if (visitsRes.error) console.warn("Could not load clinical reports");

        setInvoices(invoicesRes.data || []);

        const allVisits = visitsRes.data || [];
        allVisits.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
        setVisits(allVisits);
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setError("Some records could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchBaseRecords();
  }, []);

  // --- 2. Lazy Fetch Appointments (Visit History) ---
  useEffect(() => {
    const fetchAppointments = async () => {
      // Only fetch if tab is active and we haven't fetched yet
      if (activeTab !== "visit-history" || appointments.length > 0) return;

      setAppointmentsLoading(true);
      try {
        const response = await instance.get("/appointments/my-appointments");
        const sortedAppointments = (response.data || []).sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setAppointments(sortedAppointments);
      } catch (err) {
        console.error("Error fetching appointment history:", err);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [activeTab, appointments.length]);

  // --- 3. PDF Handler (View or Download) ---
  const handlePdfAction = async (type, fullEndpoint, fileName) => {
    if (downloadingId) return; // Prevent multiple clicks
    setDownloadingId(fullEndpoint);

    try {
      const response = await instance.get(fullEndpoint, {
        responseType: "blob",
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      if (type === "view") {
        window.open(fileURL, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      // Cleanup
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 1000);
    } catch (err) {
      console.error(`Error ${type}ing PDF:`, err);
      alert(`Failed to ${type} PDF. Please try again later.`);
    } finally {
      setDownloadingId(null);
    }
  };

  const tabs = [
    { id: "visit-history", label: "History", icon: <FaHistory /> },
    { id: "test-results", label: "Results", icon: <FaFlask /> },
    { id: "prescriptions", label: "Rx", icon: <FaFileMedical /> },
    { id: "receipts", label: "Receipts", icon: <FaReceipt /> },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
      {/* --- Header: Tabs --- */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "bg-white text-[#7F0000] shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- Body: Content Area --- */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* 1. Visit History Tab */}
        {activeTab === "visit-history" && (
          <div className="space-y-3 animate-fadeIn">
            {appointmentsLoading ? (
              <LoadingState text="Loading history..." />
            ) : appointments.length === 0 ? (
              <EmptyState text="No visit history found." />
            ) : (
              appointments.map((appt) => {
                const statusColor =
                  appt.status === "completed"
                    ? "green"
                    : appt.status === "cancelled"
                    ? "red"
                    : "yellow";

                return (
                  <div
                    key={appt._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#7F0000]/30 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-gray-800">
                        {appt.serviceType}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{formatDate(appt.appointmentDate)}</span>
                        {appt.appointmentTime && (
                          <span>• {appt.appointmentTime}</span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`bg-${statusColor}-100 text-${statusColor}-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}
                    >
                      {appt.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 2. Test Results Tab */}
        {activeTab === "test-results" && (
          <div className="space-y-3 animate-fadeIn">
            {loading ? (
              <LoadingState text="Loading reports..." />
            ) : visits.length === 0 ? (
              <EmptyState text="No clinical reports found." />
            ) : (
              visits.map((visit) => {
                const viewUrl = `/visits/my-visits/${visit._id}/pdf/view`;
                const dlUrl = `/visits/my-visits/${visit._id}/pdf/download`;
                const fName = `report-${formatDate(visit.visitDate)}.pdf`;

                return (
                  <div
                    key={visit._id}
                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          Clinical Report
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Visit Date: {formatDate(visit.visitDate)}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <ActionButton
                          icon={<FaEye />}
                          label="View"
                          onClick={() =>
                            handlePdfAction("view", viewUrl, fName)
                          }
                          isLoading={downloadingId === viewUrl}
                          disabled={!!downloadingId}
                        />
                        <ActionButton
                          icon={<FaDownload />}
                          label="Save"
                          variant="outline"
                          onClick={() =>
                            handlePdfAction("download", dlUrl, fName)
                          }
                          isLoading={downloadingId === dlUrl}
                          disabled={!!downloadingId}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="animate-fadeIn">
            {rxLoading ? (
              <LoadingState text="Loading prescription..." />
            ) : !latestRx ? (
              <EmptyState text="No active prescription found." />
            ) : (
              <div className="bg-[#7F0000]/5 p-6 rounded-3xl border border-[#7F0000]/10 mb-4">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-[#7F0000]">
                    Prescription Details
                  </h4>
                  <span className="text-xs bg-white px-3 py-1 rounded-full border border-[#7F0000]/20 text-[#7F0000] font-bold">
                    {new Date(latestRx.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Right Eye (OD) */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-2">
                      Right Eye (OD)
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-1">
                        <span className="block text-[10px] text-gray-500">
                          SPH
                        </span>
                        <span className="font-bold text-gray-800">
                          {latestRx.opticalManagement?.finalRx?.od?.sphere ||
                            "--"}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-1">
                        <span className="block text-[10px] text-gray-500">
                          CYL
                        </span>
                        <span className="font-bold text-gray-800">
                          {latestRx.opticalManagement?.finalRx?.od?.cylinder ||
                            "--"}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-1">
                        <span className="block text-[10px] text-gray-500">
                          AXIS
                        </span>
                        <span className="font-bold text-gray-800">
                          {latestRx.opticalManagement?.finalRx?.od?.axis ||
                            "--"}
                        </span>
                      </div>
                    </div>
                    {latestRx.opticalManagement?.finalRx?.od?.add && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500 mr-2">ADD:</span>
                        <span className="font-bold">
                          {latestRx.opticalManagement.finalRx.od.add}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Left Eye (OS) */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-2">
                      Left Eye (OS)
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-1">
                        <span className="block text-[10px] text-gray-500">
                          SPH
                        </span>
                        <span className="font-bold text-gray-800">
                          {latestRx.opticalManagement?.finalRx?.os?.sphere ||
                            "--"}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-1">
                        <span className="block text-[10px] text-gray-500">
                          CYL
                        </span>
                        <span className="font-bold text-gray-800">
                          {latestRx.opticalManagement?.finalRx?.os?.cylinder ||
                            "--"}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-1">
                        <span className="block text-[10px] text-gray-500">
                          AXIS
                        </span>
                        <span className="font-bold text-gray-800">
                          {latestRx.opticalManagement?.finalRx?.os?.axis ||
                            "--"}
                        </span>
                      </div>
                    </div>
                    {latestRx.opticalManagement?.finalRx?.os?.add && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500 mr-2">ADD:</span>
                        <span className="font-bold">
                          {latestRx.opticalManagement.finalRx.os.add}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {latestRx.opticalManagement?.lensType && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {latestRx.opticalManagement.lensType}
                    </span>
                  )}
                  {latestRx.opticalManagement?.materials && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">
                      {latestRx.opticalManagement.materials}
                    </span>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-500 italic text-center">
                  * For official signed copies, please visit the clinic.
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Receipts Tab */}
        {activeTab === "receipts" && (
          <div className="space-y-3 animate-fadeIn">
            {loading ? (
              <LoadingState text="Loading invoices..." />
            ) : invoices.length === 0 ? (
              <EmptyState text="No invoices found." />
            ) : (
              invoices.map((inv) => {
                const viewUrl = `/invoices/${inv._id}/pdf/view`;
                const dlUrl = `/invoices/${inv._id}/pdf/download`;
                const fName = `invoice-${inv.invoiceNumber}.pdf`;

                return (
                  <div
                    key={inv._id}
                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          Invoice #{inv.invoiceNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(inv.invoiceDate)}
                        </p>
                      </div>
                      <p className="font-mono font-bold text-[#7F0000]">
                        ₱{inv.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <ActionButton
                        icon={<FaEye />}
                        label="View"
                        size="small"
                        onClick={() => handlePdfAction("view", viewUrl, fName)}
                        isLoading={downloadingId === viewUrl}
                        disabled={!!downloadingId}
                      />
                      <ActionButton
                        icon={<FaDownload />}
                        label="Download"
                        variant="outline"
                        size="small"
                        onClick={() =>
                          handlePdfAction("download", dlUrl, fName)
                        }
                        isLoading={downloadingId === dlUrl}
                        disabled={!!downloadingId}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Helper Components for cleaner code ---

const LoadingState = ({ text }) => (
  <div className="h-40 flex flex-col items-center justify-center text-gray-400">
    <FaSpinner className="animate-spin mb-2 text-[#7F0000]" size={24} />
    <span className="text-xs font-medium">{text}</span>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    {text}
  </div>
);

const ActionButton = ({
  icon,
  label,
  onClick,
  isLoading,
  disabled,
  variant = "solid",
  size = "normal",
}) => {
  const baseClass =
    "rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeClass =
    size === "small"
      ? "py-1.5 px-3 text-xs flex-1"
      : "py-2 px-4 text-sm flex-1";

  const colorClass =
    variant === "solid"
      ? "bg-gray-900 text-white hover:bg-[#7F0000]"
      : "border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#7F0000] hover:border-[#7F0000]/30";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${sizeClass} ${colorClass}`}
    >
      {isLoading ? <FaSpinner className="animate-spin" /> : icon}
      {label}
    </button>
  );
};

export default MedicalRecords;
