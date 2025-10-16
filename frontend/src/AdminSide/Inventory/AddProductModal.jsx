import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const initialFormState = {
    name: "", // maps to productName
    type: "", // maps to productType
    description: "", // maps to productDescription
    price: "", // maps to productPrice
    stock: "", // maps to availableStocks
    sku: "", // not used in schema but kept for future use
    status: "in stock", // maps to stocksStatus
    productImage: "", // maps to productImage
  };

  const PRODUCT_TYPES = [
    { value: "prescription glasses", label: "Prescription Glasses" },
    { value: "eye drop", label: "Eye Drop" },
    { value: "contact lense", label: "Contact Lense" },
    { value: "anti radiation glasses", label: "Anti Radiation Glasses" },
    { value: "anti blue light", label: "Anti Blue Light" },
  ];

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          productImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.type ||
      !formData.description ||
      !formData.price ||
      !formData.stock ||
      !formData.sku ||
      !formData.status
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate product type
    const validTypes = [
      "prescription glasses",
      "eye drop",
      "contact lense",
      "anti radiation glasses",
      "anti blue light",
    ];

    if (!validTypes.includes(formData.type)) {
      alert("Please select a valid product type");
      return;
    }

    // Format the data according to backend schema
    const product = {
      productName: formData.name,
      productType: formData.type,
      productDescription: formData.description,
      productPrice: Number(formData.price),
      availableStocks: Number(formData.stock),
      stocksStatus: formData.status,
      productImage: formData.productImage || "",
    };

    // Validate the product data matches the schema
    const requiredFields = {
      productName: "Product Name",
      productType: "Product Type",
      productDescription: "Description",
      productPrice: "Price",
      availableStocks: "Initial Stock",
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !product[key])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate number fields are positive
    if (product.productPrice <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (product.availableStocks < 0) {
      alert("Stock cannot be negative");
      return;
    }

    onAddProduct(product);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setImagePreview(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 opacity-0 animate-modal-in max-h-[90vh] overflow-y-auto">
        <div className="h-2 bg-deep-red rounded-t-xl"></div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-deep-red">Add New Product</h2>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
                placeholder="e.g., Acuvue Oasys Contact Lenses"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
              >
                <option value="">Select a product type</option>
                {PRODUCT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
                placeholder="e.g., Contact Lenses (6-pack)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
                  placeholder="e.g., ACL123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
                >
                  <option value="in stock">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out of stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>

              {imagePreview ? (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, image: "" }));
                    }}
                    className="absolute top-2 right-2 bg-red-100 text-red-700 p-1 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-deep-red transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (Max. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}

              {!imagePreview && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <ImageIcon size={16} className="mr-1" />
                  <span>Or use URL:</span>
                </div>
              )}

              {!imagePreview && (
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-deep-red focus:border-deep-red"
                  placeholder="https://example.com/image.jpg"
                />
              )}
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-deep-red text-white rounded-lg hover:bg-dark-red transition-colors"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modal-in {
          animation: modalIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AddProductModal;
