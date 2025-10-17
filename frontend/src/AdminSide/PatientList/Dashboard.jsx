import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  ChevronRight,
  Search,
  MoreVertical,
} from "lucide-react";

const Dashboard = () => {
  const [kpiData, setKpiData] = useState({
    totalPatients: 0,
    todaysAppointments: 0,
    pendingLabResults: 17, // This remains static for now
    revenueToday: 0,
  });
  const [kpiLoading, setKpiLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      setKpiLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Format today's date as YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];

        // Fetch all KPI data in parallel
        const [patientsRes, appointmentsRes, revenueRes] = await Promise.all([
          axios.get("http://localhost:5000/api/profiles/count", config),
          axios.get(
            `http://localhost:5000/api/appointments?date=${today}`,
            config
          ),
          axios.get("http://localhost:5000/api/invoices/revenue/today", config),
        ]);

        setKpiData((prevData) => ({
          ...prevData,
          totalPatients: patientsRes.data.count || 0,
          todaysAppointments: appointmentsRes.data.length || 0,
          revenueToday: revenueRes.data.totalRevenue || 0,
        }));

        // **This is the line you need to add**
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error("Error fetching KPI data:", err);
      } finally {
        setKpiLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      setPaymentsLoading(true);
      setPaymentsError(null);
      try {
        const token = localStorage.getItem("token");

        // This is the updated, single API call to your new endpoint
        const res = await axios.get(
          "http://localhost:5000/api/invoices/recent",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const recentPayments = res.data || [];
        setPayments(recentPayments);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPaymentsError("Failed to load payments");
      } finally {
        setPaymentsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const [messages] = useState([
    {
      id: 1,
      patient: "Lisa Garcia",
      preview: "I have a question about my prescription...",
      time: "2 hours ago",
    },
    {
      id: 2,
      patient: "Kevin Moore",
      preview: "When will my test results be available?",
      time: "5 hours ago",
    },
    {
      id: 3,
      patient: "Amanda White",
      preview: "I need to reschedule my appointment.",
      time: "Yesterday",
    },
    {
      id: 4,
      patient: "Paul Robinson",
      preview: "Is the doctor available next week?",
      time: "Yesterday",
    },
  ]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-gray-100 text-gray-800",
      canceled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="dashboard p-6 bg-gray-50 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Patients Card */}
        <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg overflow-hidden">
          <div className="h-2 bg-[#7F0000]"></div>
          <div className="p-5 flex items-center">
            <div className="rounded-full bg-red-50 p-3">
              <Users className="h-6 w-6 text-[#7F0000]" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-600">
                Total Patients
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {kpiLoading ? "..." : kpiData.totalPatients}
              </p>
            </div>
          </div>
        </div>

        {/* Today's Appointments Card */}
        <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg overflow-hidden">
          <div className="h-2 bg-[#7F0000]"></div>
          <div className="p-5 flex items-center">
            <div className="rounded-full bg-red-50 p-3">
              <Calendar className="h-6 w-6 text-[#7F0000]" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-600">
                Today's Appointments
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {kpiLoading ? "..." : kpiData.todaysAppointments}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Lab Results Card */}
        <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg overflow-hidden">
          <div className="h-2 bg-[#7F0000]"></div>
          <div className="p-5 flex items-center">
            <div className="rounded-full bg-red-50 p-3">
              <FileText className="h-6 w-6 text-[#7F0000]" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-600">
                Pending Lab Results
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {kpiData.pendingLabResults}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Today Card */}
        <div className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg overflow-hidden">
          <div className="h-2 bg-[#7F0000]"></div>
          <div className="p-5 flex items-center">
            <div className="rounded-full bg-red-50 p-3">
              <DollarSign className="h-6 w-6 text-[#7F0000]" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-semibold text-gray-600">
                Revenue Today
              </h2>
              <p className="text-2xl font-bold text-gray-800">
                {kpiLoading
                  ? "..."
                  : `₱${kpiData.revenueToday.toLocaleString()}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#7F0000] mb-4">
            Patient Visits Per Week
          </h2>
          <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">
              Line chart visualization would appear here
            </p>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#7F0000] mb-4">
            Patient Demographics by Age
          </h2>
          <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">
              Pie chart visualization would appear here
            </p>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Appointments Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#7F0000]">
              Upcoming Appointments
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Patient
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Doctor
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointmentsLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-gray-500"
                    >
                      Loading appointments...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-gray-500"
                    >
                      No upcoming appointments
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => {
                    const id = appointment._id || appointment.id;
                    const name =
                      appointment.fullName || appointment.patient || "Unknown";
                    const doctor = appointment.doctor || "Dr. Philip";
                    const date = appointment.appointmentDate
                      ? new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()
                      : "";
                    const time = appointment.appointmentTime || "";
                    const dateTime = [date, time].filter(Boolean).join(" ");
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{name}</td>
                        <td className="py-3 px-4">{doctor}</td>
                        <td className="py-3 px-4">{dateTime}</td>
                        <td className="py-3 px-4">
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

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#7F0000]">
              Recent Payments
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Patient
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paymentsLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-gray-500"
                    >
                      Loading payments...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-sm text-gray-500"
                    >
                      No recent payments
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => {
                    const id = p._id || p.id;
                    const name = p.patientName || p.patient || "Unknown";
                    const amount = p.totalAmount ?? p.amount ?? 0;
                    const date = p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "";
                    const method = "Cash"; // static as requested
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{name}</td>
                        <td className="py-3 px-4">₱{amount}</td>
                        <td className="py-3 px-4">{date}</td>
                        <td className="py-3 px-4">{method}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#7F0000]">
            Recent Messages
          </h2>
          <button className="text-sm text-[#7F0000] hover:text-[#8B0000] font-medium flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">{message.patient}</h3>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
