import React from "react";

const PeakHoursChart = ({ data }) => {
  // data = { "Monday": { "9:00": 5, "10:00": 2 }, ... }
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  // Operational hours: 8:00 to 17:00 (5 PM)
  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // [8, 9, ..., 17]

  // Flatten data to find max value for scaling
  let maxValue = 0;
  Object.values(data).forEach((dayData) => {
    Object.values(dayData).forEach((count) => {
      if (count > maxValue) maxValue = count;
    });
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">Peak Hours Heatmap</h3>
        <p className="text-sm text-gray-500">
          Traffic density by day and time. Darker cells indicate busier times.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px] flex flex-col gap-1">
          {/* Header Row (Hours) */}
          <div className="flex ml-24 gap-1 mb-1">
            {hours.map((h) => (
              <div
                key={h}
                className="flex-1 text-center text-[10px] font-bold text-gray-400 uppercase"
              >
                {h > 12 ? h - 12 : h} {h >= 12 ? "PM" : "AM"}
              </div>
            ))}
          </div>

          {/* Rows (Days) */}
          {days.map((day) => (
            <div key={day} className="flex gap-1 group">
              {/* Day Label */}
              <div className="w-24 text-sm font-medium text-gray-600 flex items-center">
                {day}
              </div>

              {/* Hour Cells */}
              {hours.map((h) => {
                const timeKey = `${h}:00`;
                const count = (data[day] && data[day][timeKey]) || 0;
                const intensity = maxValue > 0 ? count / maxValue : 0;

                return (
                  <div
                    key={`${day}-${h}`}
                    className="flex-1 h-10 rounded bg-gray-50 relative group/cell transition-all duration-200 hover:scale-110 hover:z-10 cursor-default"
                    style={{
                      backgroundColor: count > 0 
                        ? `rgba(220, 38, 38, ${Math.max(0.1, intensity)})` 
                        : "#f9fafb", // gray-50 for empty
                      border: count > 0 ? "none" : "1px solid #f3f4f6"
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 w-max bg-gray-900 text-white text-xs rounded-lg py-1 px-3 opacity-0 group-hover/cell:opacity-100 pointer-events-none transition-opacity shadow-lg">
                      <span className="font-bold">{day} @ {h > 12 ? h - 12 : h}:00 {h >= 12 ? "PM" : "AM"}</span>
                      <br/>
                      {count} Appointments
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-6 flex justify-between items-center text-xs text-gray-500">
         <span>Operational Hours: 8:00 AM - 5:00 PM</span>
         <div className="flex items-center gap-2">
            <span className="w-20 text-right">Intensity:</span>
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-red-50 to-deep-red"></div>
         </div>
      </div>
    </div>
  );
};

export default PeakHoursChart;
