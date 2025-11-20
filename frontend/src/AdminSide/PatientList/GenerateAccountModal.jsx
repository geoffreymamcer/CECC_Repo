import React, { useState } from "react";
import instance from "../../api/axios";

const GenerateAccountModal = ({
  isOpen,
  onClose,
  patientId,
  patientEmail,
  onAccountCreated,
}) => {
  const [email, setEmail] = useState(patientEmail || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await instance.post("/users/generate-account", {
        patientId,
        email,
      });
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        onAccountCreated(); // Notify the parent component
      }, 2000); // Close after 2 seconds to show success message
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-fadeIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Generate Patient Account
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>

          {successMessage ? (
            <div className="text-center p-4">
              <p className="text-green-600 font-medium">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-gray-600 mb-4">
                Enter the patient's email address to create their portal
                account. A temporary password will be sent to them.
              </p>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-deep-red focus:border-deep-red"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-deep-red text-white rounded-lg hover:bg-dark-red disabled:bg-gray-400"
                >
                  {isLoading ? "Generating..." : "Generate Account"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateAccountModal;
