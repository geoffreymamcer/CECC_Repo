import React from "react";
import { FaChartPie } from "react-icons/fa";
import { Pie } from "react-chartjs-2";

// Define a consistent color palette
const CHART_COLORS = [
  "#7F0000",
  "#A52A2A",
  "#CD5C5C",
  "#8B0000",
  "#B22222",
  "#DC143C",
  "#C71585",
  "#DB7093",
];

const EyeConditionChart = ({ eyeConditions }) => {
  // Calculate total from the props
  const totalPatients = eyeConditions.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const chartData = {
    labels: eyeConditions.map((condition) => condition.name),
    datasets: [
      {
        data: eyeConditions.map((condition) => condition.value),
        backgroundColor: eyeConditions.map(
          (_, index) => CHART_COLORS[index % CHART_COLORS.length]
        ),
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage =
              totalPatients > 0
                ? ((value / totalPatients) * 100).toFixed(1)
                : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <FaChartPie className="mr-2 text-deep-red" />
          Eye Condition Distribution
        </h2>
        <div className="text-sm text-gray-500">
          Total: {totalPatients} patients
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap items-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-48 h-48">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-6 md:mt-0">
          <div className="space-y-4">
            {eyeConditions.map((condition, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                ></div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 truncate pr-2">
                      {condition.name}
                    </span>
                    <span className="font-bold text-gray-800 whitespace-nowrap">
                      {condition.value} (
                      {Math.round((condition.value / totalPatients) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(condition.value / totalPatients) * 100}%`,
                        backgroundColor:
                          CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeConditionChart;
