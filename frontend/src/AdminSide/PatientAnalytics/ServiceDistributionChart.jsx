import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ServiceDistributionChart = ({ data }) => {
  // data = [{ name: "Comprehensive Exam", value: 50 }, ...]

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: [
          "#991b1b", // deep-red
          "#dc2626", // red-600
          "#f87171", // red-400
          "#fca5a5", // red-300
          "#fecaca", // red-200
          "#e5e7eb", // gray-200
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", // Thinner ring for modern look
    plugins: {
      legend: {
        display: false, // Hide default legend, using custom one
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1) + "%";
            return ` ${label}: ${value} (${percentage})`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">Service Distribution</h3>
        <p className="text-sm text-gray-500">
          Proportion of appointments by service type.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
        {/* Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-800">
              {data.reduce((a, b) => a + b.value, 0)}
            </span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="flex-1 w-full space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: chartData.datasets[0].backgroundColor[index % 6],
                  }}
                ></span>
                <span className="font-medium text-gray-700 truncate max-w-[120px]">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDistributionChart;
