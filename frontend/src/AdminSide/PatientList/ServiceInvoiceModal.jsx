// src/components/ServiceInvoiceModal.jsx
import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa"; // 1️⃣ START MODIFICATION: Added FaTimes

const ServiceInvoiceModal = ({ onClose, currentUser, patientId }) => {
  // 2️⃣ START MODIFICATION: Added state for Services list and Add Service Modal
  const [services, setServices] = useState([]);
  const [showAddServiceUI, setShowAddServiceUI] = useState(false);
  const [newServiceData, setNewServiceData] = useState({ name: "", price: "" });
  const [activeRowIndex, setActiveRowIndex] = useState(null); // Track which row triggered 'Add Service'
  // 2️⃣ END MODIFICATION

  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: new Date().toISOString().split("T")[0],
    patientId: patientId || "",
    patientName: "",
    patientAddress: "",
    createdBy: currentUser || "Admin User",
    items: [
      {
        id: 1,
        description: "",
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ],
    amountPaid: 0,
    // 3️⃣ START MODIFICATION: Add discountType
    discountType: "None", // Defaults to None
    // 3️⃣ END MODIFICATION
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 4️⃣ START MODIFICATION: Fetch Services on Mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await instance.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };
    fetchServices();
  }, []);
  // 4️⃣ END MODIFICATION

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!patientId) return;
        const res = await instance.get(`/profiles/id/${patientId}`);
        const p = res.data;
        const name = [p.firstName, p.middleName, p.lastName]
          .filter(Boolean)
          .join(" ");
        setInvoiceData((prev) => ({
          ...prev,
          patientName: name,
          patientAddress: p.address || "",
        }));
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    };
    loadProfile();
  }, [patientId]);

  const addItemRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          description: "",
          unitPrice: 0,
          discount: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItemRow = (id) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  // 5️⃣ START MODIFICATION: Updated Item Change Logic for Dropdown
  const handleItemChange = (id, field, value) => {
    // Check if user selected "Add Service"
    if (field === "description" && value === "ADD_NEW_SERVICE") {
      // Find the index of the row that triggered this
      const index = invoiceData.items.findIndex((item) => item.id === id);
      setActiveRowIndex(index);
      setShowAddServiceUI(true);
      return;
    }

    setInvoiceData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item };

          if (field === "description") {
            // Find the selected service to auto-fill price
            const selectedService = services.find((s) => s.name === value);
            updatedItem.description = value;
            updatedItem.unitPrice = selectedService ? selectedService.price : 0;
          } else {
            updatedItem[field] = value;
          }

          // Recalculate total (assuming Qty 1)
          const price = parseFloat(updatedItem.unitPrice) || 0;
          updatedItem.total = price; // Per-item discount removed, handled globally now
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };
  // 5️⃣ END MODIFICATION

  // 6️⃣ START MODIFICATION: Handle New Service Creation
  const handleCreateService = async () => {
    if (!newServiceData.name || !newServiceData.price)
      return alert("Fill all fields");
    try {
      const res = await instance.post("/services", {
        name: newServiceData.name,
        price: parseFloat(newServiceData.price),
      });

      const newService = res.data;
      setServices((prev) => [...prev, newService]); // Update dropdown list

      // Auto-select this new service for the active row
      if (activeRowIndex !== null) {
        setInvoiceData((prev) => {
          const newItems = [...prev.items];
          newItems[activeRowIndex] = {
            ...newItems[activeRowIndex],
            description: newService.name,
            unitPrice: newService.price,
            total: newService.price,
          };
          return { ...prev, items: newItems };
        });
      }

      setShowAddServiceUI(false);
      setNewServiceData({ name: "", price: "" });
    } catch (err) {
      alert("Failed to add service");
    }
  };
  // 6️⃣ END MODIFICATION

  // 7️⃣ START MODIFICATION: New Calculation Logic with Discount Type
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);

  const getDiscountAmount = () => {
    if (
      invoiceData.discountType === "Senior Citizen" ||
      invoiceData.discountType === "PWD"
    ) {
      return subtotal * 0.2;
    }
    return 0;
  };

  const discountAmount = getDiscountAmount();
  const totalAmountDue = Math.max(0, subtotal - discountAmount);
  // 7️⃣ END MODIFICATION

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        patientId: invoiceData.patientId,
        invoiceDate: new Date(invoiceData.invoiceDate),
        items: invoiceData.items.map((it) => ({
          itemName: it.description,
          qty: 1,
          unitPrice: Number(it.unitPrice) || 0,
          discount: 0, // Individual discount is 0, handled globally
          isLens: false,
        })),
        notes: invoiceData.notes,
        isServiceInvoice: true,
        // 8️⃣ START MODIFICATION: Send Discount Type to Backend
        discountType: invoiceData.discountType,
        totalAmount: totalAmountDue,
        amountPaid: totalAmountDue, // Assume full payment
        // 8️⃣ END MODIFICATION
      };

      await instance.post("/invoices", payload);
      alert("Service Invoice Created Successfully!");
      onClose();
    } catch (err) {
      console.error("Error creating service invoice:", err);
      alert("Failed to create invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7F0000] to-[#8B0000] p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Create Service Invoice
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm text-gray-600">Patient</label>
              <div className="font-bold text-gray-800">
                {invoiceData.patientName}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Date</label>
              <input
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    invoiceDate: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 focus:ring-[#7F0000] focus:border-[#7F0000]"
              />
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-2">Services Rendered</h3>
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-[#7F0000]">Service Description</th>
                  <th className="p-3 w-32 text-right text-[#7F0000]">
                    Fee (PHP)
                  </th>
                  <th className="p-3 w-32 text-right text-[#7F0000]">Total</th>
                  <th className="p-3 w-16 text-[#7F0000]"></th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      {/* 9️⃣ START MODIFICATION: Service Dropdown */}
                      <select
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full border rounded px-2 py-1 focus:ring-[#7F0000] focus:border-[#7F0000]"
                        required
                      >
                        <option value="">Select a service...</option>
                        {services.map((s) => (
                          <option key={s._id} value={s.name}>
                            {s.name} (₱{s.price})
                          </option>
                        ))}
                        <option
                          value="ADD_NEW_SERVICE"
                          className="font-bold text-[#7F0000]"
                        >
                          + Add New Service
                        </option>
                      </select>
                      {/* 9️⃣ END MODIFICATION */}
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(item.id, "unitPrice", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-right focus:ring-[#7F0000] focus:border-[#7F0000]"
                        required
                      />
                    </td>
                    <td className="p-2 text-right font-medium">
                      ₱{item.total.toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItemRow(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 text-[#7F0000] flex items-center gap-1 font-medium hover:text-[#8B0000]"
            >
              <FaPlus /> Add Service
            </button>
          </div>

          {/* 🔟 START MODIFICATION: Summary Section with Discount Dropdown */}
          <div className="flex justify-end border-t pt-4">
            <div className="w-72 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold text-gray-800">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Discount Type:</span>
                <select
                  value={invoiceData.discountType}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      discountType: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-[#7F0000] focus:border-[#7F0000] w-40"
                >
                  <option value="None">None</option>
                  <option value="Senior Citizen">Senior Citizen (20%)</option>
                  <option value="PWD">PWD (20%)</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Less Discount:</span>
                <span>- ₱{discountAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                <span className="text-lg font-bold text-[#7F0000]">
                  Total Due:
                </span>
                <span className="text-2xl font-bold text-[#7F0000]">
                  ₱{totalAmountDue.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#7F0000] text-white rounded-lg font-bold hover:bg-[#8B0000] transition-colors disabled:opacity-50 mt-2"
              >
                {isSubmitting ? "Generating..." : "Create Invoice"}
              </button>
            </div>
          </div>
          {/* 🔟 END MODIFICATION */}
        </form>
      </div>

      {/* 1️⃣1️⃣ START MODIFICATION: Add New Service Modal (Inline) */}
      {showAddServiceUI && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add New Service
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={newServiceData.name}
                  onChange={(e) =>
                    setNewServiceData({
                      ...newServiceData,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-[#7F0000] focus:border-[#7F0000]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Price (PHP)
                </label>
                <input
                  type="number"
                  value={newServiceData.price}
                  onChange={(e) =>
                    setNewServiceData({
                      ...newServiceData,
                      price: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-[#7F0000] focus:border-[#7F0000]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddServiceUI(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateService}
                  className="px-4 py-2 bg-[#7F0000] text-white rounded hover:bg-[#8B0000]"
                >
                  Save Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 1️⃣1️⃣ END MODIFICATION */}
    </div>
  );
};

export default ServiceInvoiceModal;
