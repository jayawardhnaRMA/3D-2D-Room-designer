import { useState, useEffect } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";

export default function Toast({ message, type = "info", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  }[type];

  const iconColor = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }[type];

  const icon = {
    success: <Check size={20} className={iconColor} />,
    error: <AlertCircle size={20} className={iconColor} />,
    warning: <AlertCircle size={20} className={iconColor} />,
    info: <Info size={20} className={iconColor} />,
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} ${textColor} shadow-lg z-50 max-w-sm animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      {icon}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-2 hover:opacity-70"
      >
        <X size={18} />
      </button>
    </div>
  );
}
