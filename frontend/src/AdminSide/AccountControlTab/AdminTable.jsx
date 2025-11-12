// components/AdminTable.jsx
import { ArrowUp, ArrowDown, Trash2, Loader, Users } from "lucide-react";

const AdminTable = ({ admins, loading, onPromote, onDemote, onDelete }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "Owner":
        return "bg-purple-100 text-purple-800";
      case "Super Admin":
        return "bg-blue-100 text-blue-800";
      case "Admin":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center animate-pulse">
        <Loader className="w-8 h-8 animate-spin text-deep-red mx-auto mb-4" />
        <p className="text-gray-600">Loading admin accounts...</p>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center animate-fadeIn">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No admin accounts yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first admin account to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-scaleIn">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Name
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Email
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Role
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin, index) => (
              <tr
                key={admin.id}
                className="hover:bg-gray-50 transition-colors duration-150 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{admin.name}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-gray-600">{admin.email}</div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                      admin.role
                    )}`}
                  >
                    {admin.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPromote(admin)}
                      disabled={admin.role === "Owner"}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Promote"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDemote(admin)}
                      disabled={admin.role === "Admin"}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Demote"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(admin)}
                      disabled={admin.role === "Owner"}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {admins.map((admin, index) => (
          <div
            key={admin.id}
            className="p-6 animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{admin.name}</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                  admin.role
                )}`}
              >
                {admin.role}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{admin.email}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPromote(admin)}
                disabled={admin.role === "Owner"}
                className="flex-1 inline-flex items-center justify-center gap-1 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <ArrowUp className="w-4 h-4" />
                Promote
              </button>
              <button
                onClick={() => onDemote(admin)}
                disabled={admin.role === "Admin"}
                className="flex-1 inline-flex items-center justify-center gap-1 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <ArrowDown className="w-4 h-4" />
                Demote
              </button>
              <button
                onClick={() => onDelete(admin)}
                disabled={admin.role === "Owner"}
                className="flex-1 inline-flex items-center justify-center gap-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTable;
