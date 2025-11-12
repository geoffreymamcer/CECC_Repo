// components/ToastNotification.jsx
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const ToastNotification = ({ message, type = "success", onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
  };

  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "animate-fadeInUp" : "animate-fadeOut"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-sm ${typeStyles[type]}`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
