import { useState, useEffect } from "react";
import axios from "axios";

const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState("visit-history");
  const [invoices, setInvoices] = useState([]);
  const [visits, setVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitsError, setVisitsError] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [medicalHistoryLoading, setMedicalHistoryLoading] = useState(false);
  const [medicalHistoryError, setMedicalHistoryError] = useState(null);
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
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // First, let's check the user's profile/ID
        const userResponse = await axios.get(
          "http://localhost:5000/api/profiles/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User Profile:", userResponse.data); // Log the user profile

        // Now fetch invoices
        const response = await axios.get(
          "http://localhost:5000/api/invoices/patient",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Invoices Response:", response.data); // Log the invoices response
        setInvoices(response.data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        if (err.response) {
          console.log("Error Response:", err.response.data); // Log detailed error
          setError(
            err.response.data.message ||
              "Failed to load invoices. Please try again later."
          );
        } else {
          setError("Failed to load invoices. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
    // Fetch past visits for the logged-in user
    const fetchVisits = async () => {
      setVisitsLoading(true);
      setVisitsError(null);
      try {
        const token = localStorage.getItem("token");
        // get current user's profile to obtain their id/patientId
        const profileRes = await axios.get("/api/profiles/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userProfile = profileRes.data;
        const patientId = userProfile.patientId || userProfile._id;

        // Fetch appointments for this patient
        const apptRes = await axios.get(`/api/appointments/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let appts = Array.isArray(apptRes.data)
          ? apptRes.data
          : apptRes.data.appointments || [];

        // Filter only past appointments (appointmentDate + appointmentTime < now)
        const now = new Date();
        const past = appts.filter((a) => {
          if (!a.appointmentDate) return false;
          const date = new Date(a.appointmentDate);
          // appointmentTime may be stored as string like '14:30' or '2:30 PM'
          let apptDateTime = date;
          if (a.appointmentTime) {
            // try to parse HH:mm
            const timeParts = a.appointmentTime.split(":");
            if (timeParts.length === 2) {
              const hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1], 10);
              if (!isNaN(hours) && !isNaN(minutes)) {
                apptDateTime = new Date(date);
                apptDateTime.setHours(hours, minutes, 0, 0);
              }
            }
          }
          return apptDateTime < now;
        });

        // sort descending by date (most recent first)
        past.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );

        setVisits(past);
      } catch (err) {
        console.error("Error fetching visits:", err);
        setVisitsError(
          err?.response?.data?.message || err.message || "Failed to load visits"
        );
      } finally {
        setVisitsLoading(false);
      }
    };

    fetchVisits();
    // Fetch medical history for the logged-in user
    const fetchMedicalHistory = async () => {
      setMedicalHistoryLoading(true);
      setMedicalHistoryError(null);
      try {
        const token = localStorage.getItem("token");
        const profileRes = await axios.get("/api/profiles/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userProfile = profileRes.data;
        const patientId = userProfile.patientId || userProfile._id;

        const mhRes = await axios.get(`/api/medicalhistory/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMedicalHistory(mhRes.data);
      } catch (err) {
        console.error("Error fetching medical history:", err);
        setMedicalHistoryError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load medical history"
        );
      } finally {
        setMedicalHistoryLoading(false);
      }
    };

    fetchMedicalHistory();
  }, []);

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
          <div className="p-4 rounded-lg bg-gray-50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">Recent Test Results</h4>
              <button className="px-3 py-1 bg-dark-red text-white text-sm rounded hover:bg-deep-red transition-all duration-200 transform hover:scale-[1.02]">
                Download All
              </button>
            </div>
            <div className="space-y-4">
              <div className="border p-4 rounded hover:shadow transition">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Color Vision Test</p>
                    <p className="text-sm text-gray-600">May 15, 2023</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                    Completed
                  </span>
                </div>
                <p className="mt-2">
                  Result: Mild Protanomaly (Red-weak) - Score: 87/100
                </p>
                <button className="mt-3 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]">
                  View Details
                </button>
              </div>
              <div className="border p-4 rounded hover:shadow transition">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Visual Field Test</p>
                    <p className="text-sm text-gray-600">March 10, 2023</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                    Completed
                  </span>
                </div>
                <p className="mt-2">Result: Normal peripheral vision</p>
                <button className="mt-3 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]">
                  View Details
                </button>
              </div>
            </div>
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
          <div className="p-4 rounded-lg bg-gray-50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">Invoices & Receipts</h4>
            </div>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-red mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading invoices...</p>
              </div>
            ) : error ? (
              <div className="text-red-600 p-4 text-center">{error}</div>
            ) : invoices.length === 0 ? (
              <div className="text-gray-600 text-center py-4">
                No invoices found.
              </div>
            ) : (
              <ul className="space-y-3">
                {invoices.map((invoice) => (
                  <li
                    key={invoice._id}
                    className="border p-4 rounded hover:shadow transition"
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
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            const response = await axios.get(
                              `http://localhost:5000/api/invoices/${invoice._id}/pdf/view`,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                                responseType: "blob",
                              }
                            );

                            // Create blob URL and open in new window
                            const blob = new Blob([response.data], {
                              type: "application/pdf",
                            });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, "_blank");
                          } catch (err) {
                            console.error("Error viewing PDF:", err);
                            if (err.response?.status === 403) {
                              alert(
                                "You don't have permission to view this invoice."
                              );
                            } else if (err.response?.status === 404) {
                              alert("PDF not found for this invoice.");
                            } else {
                              alert(
                                "Failed to view PDF. Please try again later."
                              );
                            }
                          }
                        }}
                        className="px-3 py-1 text-sm bg-dark-red text-white rounded hover:bg-deep-red transition-all duration-200"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            const response = await axios.get(
                              `http://localhost:5000/api/invoices/${invoice._id}/pdf/download`,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                                responseType: "blob",
                              }
                            );

                            // Create download link
                            const url = window.URL.createObjectURL(
                              new Blob([response.data], {
                                type: "application/pdf",
                              })
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute(
                              "download",
                              `invoice-${invoice.invoiceNumber}.pdf`
                            );
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);
                          } catch (err) {
                            console.error("Error downloading PDF:", err);
                            if (err.response?.status === 403) {
                              alert(
                                "You don't have permission to download this invoice."
                              );
                            } else if (err.response?.status === 404) {
                              alert("PDF not found for this invoice.");
                            } else {
                              alert(
                                "Failed to download PDF. Please try again later."
                              );
                            }
                          }
                        }}
                        className="px-3 py-1 text-sm border border-dark-red text-dark-red rounded hover:bg-red-50 transition-all duration-200"
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
