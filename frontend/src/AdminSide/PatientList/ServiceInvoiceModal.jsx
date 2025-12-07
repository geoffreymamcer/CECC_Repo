// src/components/ServiceInvoiceModal.jsx
import React, { useState, useEffect } from "react";
import instance from "../../api/axios";
import { FaTrash, FaPlus } from "react-icons/fa";

const ServiceInvoiceModal = ({ onClose, currentUser, patientId }) => {
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
        // 1️⃣ START MODIFICATION: Quantity removed from UI state initialization (defaults to 1 logic later)
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
      // 1️⃣ END MODIFICATION
    ],
    amountPaid: 0,
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Patient Info (Unchanged)
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

  // Add Item Row
  const addItemRow = () => {
    setInvoiceData((prev) => ({
      ...prev,
      // 1️⃣ START MODIFICATION: New item defaults
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
      // 1️⃣ END MODIFICATION
    }));
  };

  // Remove Item Row (Unchanged)
  const removeItemRow = (id) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  // Handle Item Change
  const handleItemChange = (id, field, value) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // 1️⃣ START MODIFICATION: Calculation logic now assumes Qty = 1
          const price = parseFloat(updatedItem.unitPrice) || 0;
          const discount = parseFloat(updatedItem.discount) || 0;
          updatedItem.total = Math.max(0, price - discount); // Removed (qty * price)
          // 1️⃣ END MODIFICATION

          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        patientId: invoiceData.patientId,
        invoiceDate: new Date(invoiceData.invoiceDate),
        items: invoiceData.items.map((it) => ({
          itemName: it.description,
          // 1️⃣ START MODIFICATION: Hardcode qty to 1 for backend validation
          qty: 1,
          // 1️⃣ END MODIFICATION
          unitPrice: Number(it.unitPrice) || 0,
          discount: Number(it.discount) || 0,
          isLens: false,
        })),
        notes: invoiceData.notes,
        isServiceInvoice: true,
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 2️⃣ START MODIFICATION: Updated Header Colors */}
        <div className="bg-gradient-to-r from-[#7F0000] to-[#8B0000] p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Create Service Invoice
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            ✕
          </button>
        </div>
        {/* 2️⃣ END MODIFICATION */}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Patient Info Read-Only */}
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
                // 2️⃣ START MODIFICATION: Updated focus ring color
                className="border rounded px-2 py-1 focus:ring-[#7F0000] focus:border-[#7F0000]"
                // 2️⃣ END MODIFICATION
              />
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-700 mb-2">Services Rendered</h3>
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  {/* 2️⃣ START MODIFICATION: Header Text Colors & Removed Qty Column */}
                  <th className="p-3 text-[#7F0000]">Service Description</th>
                  <th className="p-3 w-32 text-right text-[#7F0000]">
                    Fee (PHP)
                  </th>
                  <th className="p-3 w-32 text-right text-[#7F0000]">
                    Discount
                  </th>
                  <th className="p-3 w-32 text-right text-[#7F0000]">Total</th>
                  <th className="p-3 w-16 text-[#7F0000]"></th>
                  {/* 2️⃣ END MODIFICATION */}
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="e.g. Comprehensive Eye Exam"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        // 2️⃣ START MODIFICATION: Updated focus ring color
                        className="w-full border rounded px-2 py-1 focus:ring-[#7F0000] focus:border-[#7F0000]"
                        // 2️⃣ END MODIFICATION
                        required
                      />
                    </td>

                    {/* 1️⃣ START MODIFICATION: Removed Quantity Input Cell */}

                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(item.id, "unitPrice", e.target.value)
                        }
                        // 2️⃣ START MODIFICATION: Updated focus ring color
                        className="w-full border rounded px-2 py-1 text-right focus:ring-[#7F0000] focus:border-[#7F0000]"
                        // 2️⃣ END MODIFICATION
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(item.id, "discount", e.target.value)
                        }
                        // 2️⃣ START MODIFICATION: Updated focus ring color
                        className="w-full border rounded px-2 py-1 text-right focus:ring-[#7F0000] focus:border-[#7F0000]"
                        // 2️⃣ END MODIFICATION
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

            {/* 2️⃣ START MODIFICATION: Updated 'Add' Button Color */}
            <button
              type="button"
              onClick={addItemRow}
              className="mt-2 text-[#7F0000] flex items-center gap-1 font-medium hover:text-[#8B0000]"
            >
              <FaPlus /> Add Service
            </button>
            {/* 2️⃣ END MODIFICATION */}
          </div>

          {/* Footer Totals */}
          <div className="flex justify-end border-t pt-4">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold text-gray-800">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>

              {/* 2️⃣ START MODIFICATION: Updated Submit Button Color */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#7F0000] text-white rounded-lg font-bold hover:bg-[#8B0000] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Generating..." : "Create Invoice"}
              </button>
              {/* 2️⃣ END MODIFICATION */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceInvoiceModal;
