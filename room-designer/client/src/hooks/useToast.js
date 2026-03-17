import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message, duration = 3000) => addToast(message, "success", duration);
  const error = (message, duration = 3000) => addToast(message, "error", duration);
  const warning = (message, duration = 3000) => addToast(message, "warning", duration);
  const info = (message, duration = 3000) => addToast(message, "info", duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
