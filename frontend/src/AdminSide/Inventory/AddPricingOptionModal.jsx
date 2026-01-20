// src/components/AddPricingOptionModal.jsx
import React, { useState } from "react";
import instance from "../../api/axios";

const AddPricingOptionModal = ({
  isOpen,
  onClose,
  productId,
  category,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call the new backend endpoint
      const res = await instance.post(
        `/inventory/${productId}/pricing-options`,
        {
          category, // e.g., 'materials'
          name,
          priceMod: price,
        }
      );

      // Pass the updated product back to parent
      onSuccess(res.data);
      onClose();
      setName("");
      setPrice("");
    } catch (error) {
      alert("Failed to add option. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labels = {
    materials: "Lens Material",
    designs: "Lens Design",
    lensTypes: "Lens Type",
    coatings: "Coating/Add-on",
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
        <div className="bg-deep-red p-4 text-white">
          <h3 className="font-bold">Add New {labels[category] || "Option"}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Option Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded p-2 focus:ring-deep-red focus:border-deep-red"
              placeholder="e.g. Ultra Thin 1.74"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Additional Cost (PHP)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded p-2 focus:ring-deep-red focus:border-deep-red"
              placeholder="0"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-deep-red text-white rounded hover:bg-dark-red"
            >
              {isSubmitting ? "Saving..." : "Add Option"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPricingOptionModal;
