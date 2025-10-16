import React, { useEffect } from "react";
import { CheckCircle, X, Package, Eye } from "lucide-react";

const AddProductSuccessModal = ({
  isOpen,
  onClose,
  productName,
  productImage,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 opacity-0 animate-modal-in">
        <div className="h-2 bg-green-600 rounded-t-xl"></div>

        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Product Added Successfully!
          </h2>

          <div className="flex items-center justify-center mb-4">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-16 h-16 object-cover rounded-lg mr-3"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Package className="text-gray-400" size={24} />
              </div>
            )}

            <div className="text-left">
              <p className="font-medium text-gray-800">{productName}</p>
              <p className="text-sm text-gray-600">
                Has been added to your inventory
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              The product is now available in your inventory and can be managed
              through the inventory system.
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Eye size={16} className="mr-2" />
              View in Inventory
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
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

        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-checkmark {
          animation: checkmark 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Alternative simpler version without product details
const SimpleSuccessModal = ({
  isOpen,
  onClose,
  message = "Product added successfully!",
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-95 opacity-0 animate-modal-in">
        <div className="p-6 text-center">
          <CheckCircle
            className="text-green-600 mx-auto mb-4 animate-checkmark"
            size={64}
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Success!</h3>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AddProductSuccessModal;
export { SimpleSuccessModal };
