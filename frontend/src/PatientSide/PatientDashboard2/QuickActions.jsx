const QuickActions = () => {
  const actions = [
    { name: "Edit Profile", icon: "M9 5l7 7-7 7" },
    { name: "Change Password", icon: "M9 5l7 7-7 7" },
    { name: "Delete Account", icon: "M9 5l7 7-7 7" },
  ];

  const notifications = [
    { text: "New test results available", time: "2 hours ago", type: "info" },
    {
      text: "Appointment reminder: June 25",
      time: "1 day ago",
      type: "normal",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01]"
          >
            <span>{action.name}</span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={action.icon}
              ></path>
            </svg>
          </button>
        ))}
      </div>

      <h4 className="font-medium text-gray-800 mt-6 mb-3">Notifications</h4>
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`p-3 border rounded transition-all duration-200 transform hover:scale-[1.01] ${
              notification.type === "info"
                ? "bg-blue-50 border-blue-100"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <p className="text-sm font-medium">{notification.text}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
