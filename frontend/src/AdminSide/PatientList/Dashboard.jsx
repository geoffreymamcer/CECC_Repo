import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  ChevronRight,
  Activity,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PatientVisitsChart from "./PatientVisitsChart";
import PatientDemographicsChart from "./PatientDemographicsChart";
import MessageModal from "./MessageModal";

// --- Loading Configuration (in milliseconds) ---
// Adjust this value to control the loading state duration across all environments
const DASHBOARD_LOADING_DURATION = 1500; // 1.5 seconds

const Dashboard = () => {
  const { user } = useAuth(); // <-- 2. GET THE LOGGED-IN USER
  const isOwner = user?.role === "owner"; // <-- 3. HELPER TO CHECK IF USER IS OWNER

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [kpiData, setKpiData] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    pendingLabResults: 17, // This remains static for now
    revenueToday: 0,
  });
  const [kpiLoading, setKpiLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setKpiLoading(true);
      setAppointmentsLoading(true);
      setError(null);

      try {
        const today = new Date().toISOString().split("T")[0];

        // --- MODIFIED --- Fetch all data points in parallel
        const apiCalls = [
          instance.get("/profiles/count"),
          instance.get(`/appointments?date=${today}`), // For "Today's Appointments" KPI
          instance.get("/appointments/upcoming"), // --- NEW --- For the upcoming appointments table
          instance.get("/messages/recent"),
        ];

        if (isOwner) {
          apiCalls.push(instance.get("/invoices/revenue/today"));
          apiCalls.push(instance.get("/invoices/recent"));
        }

        const [
          patientsRes,
          todaysAppointmentsRes,
          upcomingAppointmentsRes,
          messagesRes,
          revenueRes,
          paymentsRes,
        ] = await Promise.all(apiCalls.map((p) => p.catch((e) => e)));

        // Check for errors after all promises have settled
        if (patientsRes.isAxiosError)
          throw new Error("Failed to load patient count.");
        if (todaysAppointmentsRes.isAxiosError)
          throw new Error("Failed to load today's appointments.");
        if (upcomingAppointmentsRes.isAxiosError)
          throw new Error("Failed to load upcoming appointments.");
        if (isOwner && revenueRes.isAxiosError)
          throw new Error("Failed to load revenue.");
        if (isOwner && paymentsRes.isAxiosError)
          throw new Error("Failed to load payments.");

        // --- UPDATE KPI DATA ---
        setKpiData((prevData) => ({
          ...prevData,
          totalPatients: patientsRes.data.count || 0,
          todaysAppointments: todaysAppointmentsRes.data.length || 0,
          revenueToday: revenueRes ? revenueRes.data.totalRevenue || 0 : 0,
        }));

        // --- UPDATE APPOINTMENTS TABLE DATA ---
        setAppointments(upcomingAppointmentsRes.data || []);

        setMessages(messagesRes.data || []);

        // --- UPDATE PAYMENTS TABLE DATA ---
        if (isOwner) {
          setPayments(paymentsRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // You might want a specific error state for the whole dashboard
        setError("Failed to load some dashboard data.");
      } finally {
        setKpiLoading(false);
        setAppointmentsLoading(false);
        setPaymentsLoading(false);
        setMessagesLoading(false);

        // --- Loading State Timer ---
        // Show loading spinner for configured duration, then hide it
        if (isInitialLoad) {
          const timer = setTimeout(() => {
            setIsInitialLoad(false);
          }, DASHBOARD_LOADING_DURATION);
          return () => clearTimeout(timer);
        }
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [isOwner, user]);

  // --- 6. HANDLER TO OPEN THE MODAL ---
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      canceled: "bg-rose-100 text-rose-700 border-rose-200",
    };

    const baseClass = "px-2.5 py-0.5 rounded-full text-xs font-semibold border";
    const statusKey = status.toLowerCase();

    return (
      <span
        className={`${baseClass} ${
          styles[statusKey] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      {isInitialLoad && kpiLoading ? (
        <div className="flex justify-center items-center h-screen bg-gray-50/50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-deep-red rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-6 h-6 text-deep-red animate-pulse" />
              </div>
            </div>
            <p className="text-gray-500 font-medium animate-pulse">
              Initializing Dashboard...
            </p>
          </div>
        </div>
      ) : (
        <div className="dashboard p-6 lg:p-8 bg-gray-50 h-screen overflow-y-auto font-sans text-slate-800">
          {/* Header Section */}

          {/* KPI Cards Section - Grid Revamp */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Reusable KPI Card Component Logic Inline for Clarity */}
            {[
              {
                label: "Total Patients",
                value: kpiData.totalPatients,
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Today's Appointments",
                value: kpiData.todaysAppointments,
                icon: Calendar,
                color: "text-deep-red",
                bg: "bg-red-50",
              },

              isOwner && {
                label: "Revenue Today",
                value: `₱${kpiData.revenueToday.toLocaleString()}`,
                icon: DollarSign,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
            ]
              .filter(Boolean)
              .map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    {/* Visual flourish */}
                    <div className="text-gray-300">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {kpiLoading ? (
                        <span className="animate-pulse bg-gray-200 h-8 w-16 block rounded"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="transform transition-all duration-300 hover:scale-[1.005]">
              <PatientVisitsChart />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.005]">
              <PatientDemographicsChart />
            </div>
          </div>

          {/* Tables & Messages Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Left Column: Tables (Spans 2 columns on large screens) */}
            <div className="xl:col-span-2 flex flex-col gap-8">
              {/* Appointments Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-deep-red" /> Upcoming
                    Appointments
                  </h2>
                </div>
                <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {appointmentsLoading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-gray-500"
                          >
                            Loading appointments...
                          </td>
                        </tr>
                      ) : appointments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-gray-500 italic"
                          >
                            No upcoming appointments found.
                          </td>
                        </tr>
                      ) : (
                        appointments.map((appointment) => {
                          const id = appointment._id || appointment.id;
                          const name =
                            appointment.fullName ||
                            appointment.patient ||
                            "Unknown";
                          const doctor = appointment.doctor || "Dr. Philip";
                          // Format Date nicely
                          const rawDate = appointment.appointmentDate
                            ? new Date(appointment.appointmentDate)
                            : null;
                          const dateStr = rawDate
                            ? rawDate.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })
                            : "";
                          const timeStr = appointment.appointmentTime || "";

                          return (
                            <tr
                              key={id}
                              className="hover:bg-gray-50/80 transition-colors"
                            >
                              <td className="py-4 px-6 font-medium text-gray-900">
                                {name}
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {doctor}
                              </td>
                              <td className="py-4 px-6 text-gray-600 text-sm">
                                <div className="flex flex-col">
                                  <span className="font-semibold">
                                    {dateStr}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {timeStr}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                {getStatusBadge(appointment.status)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payments Table (Owner Only) */}
              {isOwner && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-600" /> Recent
                      Payments
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {paymentsLoading ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-8 text-center text-gray-500"
                            >
                              Loading payments...
                            </td>
                          </tr>
                        ) : payments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-8 text-center text-gray-500 italic"
                            >
                              No recent payments.
                            </td>
                          </tr>
                        ) : (
                          payments.map((p) => {
                            const id = p._id || p.id;
                            const name =
                              p.patientName || p.patient || "Unknown";
                            const amount = p.totalAmount ?? p.amount ?? 0;
                            const date = p.createdAt
                              ? new Date(p.createdAt).toLocaleDateString()
                              : "";

                            return (
                              <tr
                                key={id}
                                className="hover:bg-gray-50/80 transition-colors"
                              >
                                <td className="py-4 px-6 font-medium text-gray-900">
                                  {name}
                                </td>
                                <td className="py-4 px-6 font-bold text-emerald-600">
                                  ₱{amount.toLocaleString()}
                                </td>
                                <td className="py-4 px-6 text-gray-600 text-sm">
                                  {date}
                                </td>
                                <td className="py-4 px-6 text-gray-600 text-xs uppercase tracking-wide bg-gray-100 rounded inline-block mt-2 ">
                                  Cash
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Messages Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full max-h-[600px]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30 rounded-t-2xl">
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Messages
                </h2>
                <button className="text-sm text-deep-red hover:text-red-800 font-semibold flex items-center transition-colors">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {messagesLoading ? (
                  <p className="py-10 text-center text-sm text-gray-500">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-10">
                    <Activity className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 text-sm">No new messages.</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const fullName = `${message.sender.firstName} ${message.sender.lastName}`;
                    const initials = `${message.sender.firstName[0]}${message.sender.lastName[0]}`;

                    return (
                      <div
                        key={message._id}
                        className="group p-3 hover:bg-red-50/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-red-100"
                        onClick={() => handleViewMessage(message)}
                      >
                        <div className="flex gap-3">
                          {/* Avatar Placeholder */}
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-deep-red font-bold text-xs">
                            {initials}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                              <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-deep-red transition-colors">
                                {fullName}
                              </h3>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                {new Date(message.createdAt).toLocaleDateString(
                                  undefined,
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate font-medium">
                              {message.conversation.subject}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              Click to view conversation...
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <MessageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            message={selectedMessage}
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;
