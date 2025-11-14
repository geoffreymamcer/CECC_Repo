// components/AccountControl.jsx
import { useState, useEffect } from "react";
import { UserPlus, Users, Lock } from "lucide-react";
import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import ConfirmActionModal from "./ConfirmActionModal";
import ToastNotification from "./ToastNotification";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const AccountControl = () => {
  const [admins, setAdmins] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // Mock initial data - replace with actual API calls
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/users/admins");
      if (response.data.status === "success") {
        setAdmins(response.data.data);
      } else {
        showToast(response.data.message || "Failed to fetch admins", "error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching admins.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateAdmin = async (adminData) => {
    try {
      const response = await axios.post("/users/admin/create", adminData);

      if (response.data.status === "success") {
        setAdmins((prev) => [response.data.data, ...prev]);
        setIsAddModalOpen(false); // Close modal on success
        showToast("Admin account created successfully!");
        return true; // Indicate success to the modal
      } else {
        // This path is less likely with axios but good for safety
        showToast(response.data.message || "Failed to create admin.", "error");
        return false;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while creating the admin.";
      showToast(errorMessage, "error");
      return false; // Indicate failure to the modal
    }
  };

  const updateRole = async (admin, newRole) => {
    try {
      const response = await axios.patch(`/users/admin/role/${admin.id}`, {
        role: newRole,
      });
      if (response.data.status === "success") {
        // Update the state with the exact data returned from the server
        setAdmins((prevAdmins) =>
          prevAdmins.map((a) => (a.id === admin.id ? response.data.data : a))
        );
        showToast(response.data.message, "success");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || `An error occurred during the action.`;
      showToast(errorMessage, "error");
    }
  };

  const handlePromote = (admin) => {
    // Simplified role hierarchy to match schema
    const roleHierarchy = ["Admin", "Owner"];
    const currentIndex = roleHierarchy.indexOf(admin.role);
    if (currentIndex < roleHierarchy.length - 1) {
      const newRole = roleHierarchy[currentIndex + 1];
      updateRole(admin, newRole);
    } else {
      showToast("User is already at the highest role.", "info");
    }
  };

  const handleDemote = (admin) => {
    const roleHierarchy = ["Admin", "Owner"];
    const currentIndex = roleHierarchy.indexOf(admin.role);
    if (currentIndex > 0) {
      const newRole = roleHierarchy[currentIndex - 1];
      updateRole(admin, newRole);
    } else {
      showToast("User is already at the lowest role.", "info");
    }
  };

  const handleDelete = async (adminId) => {
    try {
      const response = await axios.delete(`/users/admin/${adminId}`);
      if (response.data.status === "success") {
        setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
        showToast("Admin account deleted successfully!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the account.";
      showToast(errorMessage, "error");
    }
  };

  const openConfirmModal = (action, admin) => {
    setConfirmModalConfig({ action, admin });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    const { action, admin } = confirmModalConfig;

    switch (action) {
      case "promote":
        handlePromote(admin);
        break;
      case "demote":
        handleDemote(admin);
        break;
      case "delete":
        handleDelete(admin.id);
        break;
      default:
        break;
    }

    setIsConfirmModalOpen(false);
    setConfirmModalConfig(null);
  };

  const getActionText = (action, admin) => {
    switch (action) {
      case "promote":
        return `promote ${admin.name} to a higher role`;
      case "demote":
        return `demote ${admin.name} to a lower role`;
      case "delete":
        return `delete ${admin.name}'s account`;
      default:
        return "perform this action";
    }
  };

  if (user.role !== "owner") {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-6 text-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-200">
          <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You do not have the required permissions to view this page.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Please contact the clinic owner if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fadeIn">
      {/* Header Section */}
      <header className="mb-8 animate-fadeInUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-deep-red" />
              Account Control
            </h1>
            <p className="text-gray-600 mt-2">
              Manage admin accounts and their permissions
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-deep-red text-white px-6 py-3 rounded-lg hover:bg-dark-red transition-colors duration-200 font-medium animate-scaleIn"
          >
            <UserPlus className="w-5 h-5" />
            Add Admin
          </button>
        </div>
      </header>

      {/* Admin Table */}
      <AdminTable
        admins={admins}
        loading={loading}
        onPromote={(admin) => openConfirmModal("promote", admin)}
        onDemote={(admin) => openConfirmModal("demote", admin)}
        onDelete={(admin) => openConfirmModal("delete", admin)}
      />

      {/* Modals */}
      <AdminFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateAdmin}
      />

      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setConfirmModalConfig(null);
        }}
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        message={
          confirmModalConfig &&
          `Are you sure you want to ${getActionText(
            confirmModalConfig.action,
            confirmModalConfig.admin
          )}? This action cannot be undone.`
        }
        confirmText={
          confirmModalConfig?.action === "delete"
            ? "Delete"
            : confirmModalConfig?.action === "promote"
            ? "Promote"
            : "Demote"
        }
        variant={confirmModalConfig?.action === "delete" ? "danger" : "primary"}
      />

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AccountControl;
