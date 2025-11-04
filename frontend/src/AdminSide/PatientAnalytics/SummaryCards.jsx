import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import {
  FaUsers,
  FaCalendarCheck,
  FaUserPlus,
  FaSyncAlt,
} from "react-icons/fa";

const SummaryCards = ({ loading: parentLoading }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (parentLoading) return;

    const fetchSummaryData = async () => {
      setLoading(true);
      try {
        const response = await instance.get("/analytics/summary-cards");
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching summary card stats:", err);
        setError("Could not load summary stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [parentLoading]);

  if (loading || parentLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-28 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 mt-6">
        <div className="col-span-full bg-red-100 text-red-700 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Patients",
      value: stats.totalPatients.toLocaleString(),
      Icon: FaUsers,
      color: "from-deep-red to-dark-red",
    },
    {
      title: "Monthly Visits",
      value: stats.monthlyVisits.toLocaleString(),
      Icon: FaCalendarCheck,
      color: "from-blue-600 to-blue-800",
    },
    {
      title: "Patient Retention",
      value: `${stats.retentionRate}%`,
      Icon: FaSyncAlt,
      color: "from-green-600 to-green-800",
    },
    {
      title: "New Patients (30d)",
      value: stats.newPatients.toLocaleString(),
      Icon: FaUserPlus,
      color: "from-purple-600 to-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 animate-fadeIn">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium opacity-80">{card.title}</span>
            <card.Icon className="opacity-50" size={20} />
          </div>
          <div className="text-3xl font-bold mt-2">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
