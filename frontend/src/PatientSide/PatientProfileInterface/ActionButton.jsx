import React from "react";
import "./PatientProfileInterface.css";

const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button className="bg-gradient-to-r from-[#7F0000] to-[#8B0000] py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:from-[#8B0000] hover:to-[#6d0000]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        Edit Profile
      </button>

      <button className="bg-white border border-red-200 text-red-600 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-red-50 hover:shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Delete
      </button>

      <button className="bg-white border border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clipRule="evenodd"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default ActionButtons;
