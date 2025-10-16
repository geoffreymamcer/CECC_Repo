// src/components/InvoiceModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaPlus,
  FaSearch,
} from "react-icons/fa";

import "../AdminSideAssets/CECC-Invoice-Template.pdf";

const InvoiceInputModal = ({ onClose, currentUser, patientId }) => {
  // State for collapsible sections
  const [openSection, setOpenSection] = useState({
    patientInfo: true,
    items: true,
    payment: true,
  });

  // State for form fields
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    jobOrderNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    patientId: patientId || "",
    patientName: "",
    patientAddress: "",
    patientTelephone: "",
    createdBy: currentUser || "Admin User",
    deliveryDate: "",
    items: [
      {
        id: 1,
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
        isLens: false,
        prescription: { rightEye: {}, leftEye: {} },
        tint: "",
      },
    ],
    amountPaid: 0,
    notes: "",
  });

  // State for patient search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Helper to map UI labels to backend schema keys
  const toSchemaKey = (label) => {
    const map = {
      Sph: "sph",
      Cyl: "cyl",
      Axis: "axis",
      Add: "add",
      PD: "pd",
      "Mono PD": "monoPd",
      SH: "sh",
      BC: "bc",
      Dia: "dia",
    };
    return map[label] || label.toLowerCase();
  };

  // Live preview numbers from backend (no increment)
  const [previewNumbers, setPreviewNumbers] = useState({
    invoiceNumber: "",
    jobOrderNumber: "",
  });
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/invoices/preview/next?date=${invoiceData.invoiceDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPreviewNumbers(res.data);
      } catch (e) {
        setPreviewNumbers({ invoiceNumber: "", jobOrderNumber: "" });
      }
    };
    if (invoiceData.invoiceDate) fetchPreview();
  }, [invoiceData.invoiceDate]);

  // State for inventory products
  const [products, setProducts] = useState([]);

  // Fetch products from inventory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/inventory",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Get the products array, handling both paginated and non-paginated responses
        const productsArray = response.data.products || response.data;

        if (!Array.isArray(productsArray)) {
          console.error("Products data is not an array:", productsArray);
          return;
        }

        const inventoryProducts = productsArray
          .filter((product) => product && product.availableStocks > 0)
          .map((product) => ({
            id: product._id,
            name: product.productName,
            price: product.productPrice,
            description: product.productDescription || "",
            isLens: (product.productDescription?.toLowerCase() || "").includes(
              "lens"
            ),
          }));
        setProducts(inventoryProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        alert("Failed to load product list. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle patient search
  useEffect(() => {
    // Auto-load patient details from backend Profile
    const loadProfile = async () => {
      try {
        if (!patientId) return;
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/profiles/id/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const p = res.data;
        const name = [p.firstName, p.middleName, p.lastName]
          .filter(Boolean)
          .join(" ");
        setInvoiceData((prev) => ({
          ...prev,
          patientId: patientId,
          patientName: name,
          patientAddress: p.address?.display || p.address || "",
          patientTelephone: p.contact || p.phone_number || "",
        }));
        setSearchTerm(patientId);
      } catch (e) {
        // silent fail; fields stay empty
      }
    };
    loadProfile();
  }, [patientId]);

  // Select a patient from search results
  const selectPatient = (patient) => {
    // Not used when patientId is provided; keep for future enhancements
    setInvoiceData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      patientAddress: patient.address,
      patientTelephone: patient.telephone,
    }));
    setSearchTerm(`${patient.id} - ${patient.name}`);
    setShowResults(false);
  };

  // Add a new item row
  const addItemRow = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
      isLens: false,
      prescription: { rightEye: {}, leftEye: {} },
      tint: "",
    };
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove an item row
  const removeItemRow = (id) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  // Handle item field changes
  const handleItemChange = (id, field, value) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item };

          if (field === "description") {
            // Find the selected product and set its price
            const selectedProduct = products.find((p) => p.name === value);
            if (selectedProduct) {
              updatedItem.description = value;
              updatedItem.unitPrice = selectedProduct.price;
              updatedItem.isLens = selectedProduct.isLens;
            } else {
              updatedItem.description = value;
              updatedItem.unitPrice = 0;
              updatedItem.isLens = false;
            }
          } else {
            updatedItem[field] = value;
          }

          // Always recalculate total based on quantity and discount
          const quantity = parseFloat(updatedItem.quantity) || 0;
          const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
          const discount = parseFloat(updatedItem.discount) || 0;
          updatedItem.total = quantity * unitPrice - discount;

          return updatedItem;
        }
        return item;
      });

      return { ...prev, items: updatedItems };
    });
  };

  // Handle prescription field changes
  const handlePrescriptionChange = (itemId, eye, field, value) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedPrescription = {
            ...item.prescription,
            [eye]: { ...item.prescription[eye], [toSchemaKey(field)]: value },
          };
          return { ...item, prescription: updatedPrescription };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  // Handle tint change
  const handleTintChange = (itemId, value) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, tint: value };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  // Calculate subtotal
  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );

  // Calculate total amount due
  const totalAmountDue = subtotal - parseFloat(invoiceData.amountPaid || 0);

  // State for invoice creation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        patientId: invoiceData.patientId,
        invoiceDate: invoiceData.invoiceDate
          ? new Date(invoiceData.invoiceDate)
          : undefined,
        deliveryDate: invoiceData.deliveryDate
          ? new Date(invoiceData.deliveryDate)
          : undefined,
        items: invoiceData.items.map((it) => ({
          itemName: it.description,
          qty: Number(it.quantity) || 0,
          unitPrice: Number(it.unitPrice) || 0,
          discount: Number(it.discount) || 0,
          isLens: !!it.isLens,
          tint: it.tint || "",
          rightEye: it.prescription?.rightEye || {},
          leftEye: it.prescription?.leftEye || {},
        })),
        notes: invoiceData.notes,
      };
      const res = await axios.post(
        "http://localhost:5000/api/invoices",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const created = res.data;
      console.log("Invoice created successfully:", created);

      // Update inventory stocks
      try {
        // Create an array of updates for each item
        const stockUpdates = invoiceData.items
          .map((item) => {
            const product = products.find((p) => p.name === item.description);
            if (!product) return null;
            return {
              productId: product.id,
              quantity: parseInt(item.quantity) || 0,
            };
          })
          .filter((update) => update !== null);

        // Make the update request
        if (stockUpdates.length > 0) {
          await Promise.all(
            stockUpdates.map((update) =>
              axios.put(
                `http://localhost:5000/api/inventory/${update.productId}/reduce-stock`,
                { quantity: update.quantity },
                { headers: { Authorization: `Bearer ${token}` } }
              )
            )
          );
          console.log("Inventory stocks updated successfully");
        }
      } catch (stockError) {
        console.error("Error updating inventory stocks:", stockError);
        alert(
          "Invoice created but failed to update inventory stocks. Please update stocks manually."
        );
      }

      // Check if PDF was generated
      if (created.pdfData) {
        console.log(
          "PDF data found in response, size:",
          created.pdfData.length
        );
      } else {
        console.log("No PDF data in response");
      }

      setCreatedInvoice(created);
      // Don't close modal yet - show success with download option
    } catch (err) {
      console.error("Invoice creation error:", err);
      if (err.response) {
        console.error(
          "Error response:",
          err.response.status,
          err.response.data
        );
        alert(
          `Failed to create invoice: ${
            err.response.data?.message || "Unknown error"
          }`
        );
      } else if (err.request) {
        alert(
          "Cannot connect to server. Please check if the backend is running."
        );
      } else {
        alert(`Failed to create invoice: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!createdInvoice) return;

    try {
      const token = localStorage.getItem("token");
      console.log(
        "Attempting to download PDF for invoice:",
        createdInvoice._id
      );

      const response = await axios.get(
        `http://localhost:5000/api/invoices/${createdInvoice._id}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      console.log(
        "PDF download response received:",
        response.status,
        response.headers
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoice-${createdInvoice.invoiceNumber}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("PDF download completed successfully");
    } catch (error) {
      console.error("PDF download error:", error);

      if (error.response) {
        // Server responded with error status
        console.error(
          "Error response:",
          error.response.status,
          error.response.data
        );
        if (error.response.status === 404) {
          alert(
            "PDF not found. The invoice may not have been generated properly."
          );
        } else if (error.response.status === 500) {
          alert("Server error while generating PDF. Please try again.");
        } else {
          alert(
            `Download failed: ${error.response.status} - ${
              error.response.data?.message || "Unknown error"
            }`
          );
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        alert(
          "Cannot connect to server. Please check if the backend is running."
        );
      } else {
        // Something else happened
        console.error("Other error:", error.message);
        alert(`Download failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#7F0000] to-[#8B0000] p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Create Patient Invoice
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Section 1: General & Patient Information */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center bg-gray-50 p-4 cursor-pointer"
              onClick={() => toggleSection("patientInfo")}
            >
              <h3 className="text-lg font-semibold text-[#7F0000]">
                General & Patient Information
              </h3>
              {openSection.patientInfo ? (
                <FaChevronUp className="text-[#7F0000]" />
              ) : (
                <FaChevronDown className="text-[#7F0000]" />
              )}
            </div>

            {openSection.patientInfo && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Auto-generated fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={previewNumbers.invoiceNumber || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Order No.
                    </label>
                    <input
                      type="text"
                      value={previewNumbers.jobOrderNumber || ""}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          invoiceDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created By
                    </label>
                    <input
                      type="text"
                      value={invoiceData.createdBy}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Patient information */}
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={invoiceData.patientId}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            patientId: e.target.value,
                          }))
                        }
                        placeholder="Patient ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10 focus:ring-[#7F0000] focus:border-[#7F0000]"
                        readOnly={!!patientId}
                      />
                      <FaSearch className="absolute right-3 top-3 text-gray-400" />
                    </div>

                    {showResults && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((patient) => (
                          <div
                            key={patient.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors"
                            onClick={() => selectPatient(patient)}
                          >
                            <div className="font-medium">
                              {patient.id} - {patient.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {patient.telephone}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={invoiceData.patientName}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Address
                    </label>
                    <input
                      type="text"
                      value={invoiceData.patientAddress}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Telephone
                    </label>
                    <input
                      type="text"
                      value={invoiceData.patientTelephone}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      value={invoiceData.deliveryDate}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          deliveryDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Itemized Products & Services */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center bg-gray-50 p-4 cursor-pointer"
              onClick={() => toggleSection("items")}
            >
              <h3 className="text-lg font-semibold text-[#7F0000]">
                Itemized Products & Services
              </h3>
              {openSection.items ? (
                <FaChevronUp className="text-[#7F0000]" />
              ) : (
                <FaChevronDown className="text-[#7F0000]" />
              )}
            </div>

            {openSection.items && (
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-[#7F0000] uppercase tracking-wider">
                          Item Description
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-[#7F0000] uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#7F0000] uppercase tracking-wider">
                          Unit Price (PHP)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#7F0000] uppercase tracking-wider">
                          Discount (PHP)
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-[#7F0000] uppercase tracking-wider">
                          Total (PHP)
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-[#7F0000] uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoiceData.items.map((item) => (
                        <React.Fragment key={item.id}>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <select
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000]"
                              >
                                <option value="">Select an item</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.name}>
                                    {product.name} (${product.price})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-[#7F0000] focus:border-[#7F0000]"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.unitPrice}
                                readOnly
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right bg-gray-100 cursor-not-allowed"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.discount}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "discount",
                                    e.target.value
                                  )
                                }
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right focus:ring-[#7F0000] focus:border-[#7F0000]"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <input
                                type="text"
                                value={`PHP${item.total.toFixed(2)}`}
                                readOnly
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-right"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <button
                                type="button"
                                onClick={() => removeItemRow(item.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>

                          {/* Prescription Details (only for lenses) */}
                          {item.isLens && (
                            <tr>
                              <td colSpan="6" className="px-4 py-3 bg-gray-50">
                                <div className="ml-4">
                                  <h4 className="font-medium text-[#7F0000] mb-2">
                                    Prescription Details
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Right Eye */}
                                    <div className="border border-gray-200 rounded-md p-3">
                                      <h5 className="font-medium text-center mb-2">
                                        Right Eye
                                      </h5>
                                      <div className="grid grid-cols-2 gap-2">
                                        {[
                                          "Sph",
                                          "Cyl",
                                          "Axis",
                                          "Add",
                                          "PD",
                                          "Mono PD",
                                          "SH",
                                          "BC",
                                          "Dia",
                                        ].map((field) => (
                                          <div key={`right-${field}`}>
                                            <label className="block text-xs text-gray-600 mb-1">
                                              {field}
                                            </label>
                                            <input
                                              type="text"
                                              placeholder={field}
                                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-[#7F0000] focus:border-[#7F0000]"
                                              onChange={(e) =>
                                                handlePrescriptionChange(
                                                  item.id,
                                                  "rightEye",
                                                  field,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Left Eye */}
                                    <div className="border border-gray-200 rounded-md p-3">
                                      <h5 className="font-medium text-center mb-2">
                                        Left Eye
                                      </h5>
                                      <div className="grid grid-cols-2 gap-2">
                                        {[
                                          "Sph",
                                          "Cyl",
                                          "Axis",
                                          "Add",
                                          "PD",
                                          "Mono PD",
                                          "SH",
                                          "BC",
                                          "Dia",
                                        ].map((field) => (
                                          <div key={`left-${field}`}>
                                            <label className="block text-xs text-gray-600 mb-1">
                                              {field}
                                            </label>
                                            <input
                                              type="text"
                                              placeholder={field}
                                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-[#7F0000] focus:border-[#7F0000]"
                                              onChange={(e) =>
                                                handlePrescriptionChange(
                                                  item.id,
                                                  "leftEye",
                                                  field,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Tint */}
                                    <div className="col-span-full">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tint
                                      </label>
                                      <select
                                        value={item.tint}
                                        onChange={(e) =>
                                          handleTintChange(
                                            item.id,
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000]"
                                      >
                                        <option value="">Select tint</option>
                                        <option value="Clarity Green">
                                          Clarity Green
                                        </option>
                                        <option value="Brown">Brown</option>
                                        <option value="Gray">Gray</option>
                                        <option value="Blue">Blue</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={addItemRow}
                  className="mt-4 flex items-center text-sm text-[#7F0000] font-medium hover:text-[#8B0000] transition-colors"
                >
                  <FaPlus className="mr-1" /> Add Item
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Payment and Summary */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center bg-gray-50 p-4 cursor-pointer"
              onClick={() => toggleSection("payment")}
            >
              <h3 className="text-lg font-semibold text-[#7F0000]">
                Payment and Summary
              </h3>
              {openSection.payment ? (
                <FaChevronUp className="text-[#7F0000]" />
              ) : (
                <FaChevronDown className="text-[#7F0000]" />
              )}
            </div>

            {openSection.payment && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-[#7F0000] mb-3">
                        Payment Information
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Subtotal:</span>
                          <span className="font-medium">
                            PHP{subtotal.toFixed(2)}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount Paid (PHP)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={subtotal}
                            value={invoiceData.amountPaid}
                            onChange={(e) =>
                              setInvoiceData({
                                ...invoiceData,
                                amountPaid: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000]"
                          />
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                          <span className="text-lg font-semibold text-[#7F0000]">
                            Total Amount Due:
                          </span>
                          <span className="text-lg font-semibold">
                            PHP{Math.max(totalAmountDue, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg h-full border border-gray-200">
                      <h4 className="font-medium text-[#7F0000] mb-3">Notes</h4>
                      <textarea
                        value={invoiceData.notes}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Special instructions or comments..."
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#7F0000] focus:border-[#7F0000]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          {createdInvoice && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Invoice Created Successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Invoice Number:{" "}
                      <strong>{createdInvoice.invoiceNumber}</strong>
                    </p>
                    <p>
                      Job Order Number:{" "}
                      <strong>{createdInvoice.jobOrderNumber}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            {!createdInvoice ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-[#7F0000] to-[#8B0000] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Invoice"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceInputModal;
