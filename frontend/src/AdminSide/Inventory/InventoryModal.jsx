import React, { useEffect } from "react";
import { X } from "lucide-react";

const InventoryModal = ({
  action,
  product,
  quantity,
  setQuantity,
  price,
  setPrice,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-modal-in">
        <div className="h-2 bg-deep-red rounded-t-xl"></div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-deep-red">
              {action === "add" && "Add Stock"}
              {action === "subtract" && "Subtract Stock"}
              {action === "delete" && "Delete Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {action !== "delete" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-deep-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Update Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-deep-red"
                />
              </div>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-600 font-medium">
                Are you sure you want to delete {product.name}?
              </p>
              <p className="text-red-500 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg ${
              action === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-deep-red hover:bg-dark-red"
            }`}
          >
            {action === "add" && "Add Stock"}
            {action === "subtract" && "Subtract Stock"}
            {action === "delete" && "Delete Product"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
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

export default InventoryModal;
