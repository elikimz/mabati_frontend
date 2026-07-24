import { useState, useCallback } from "react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastItem["type"] = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addToast(message, "success"),
    [addToast]
  );
  const error = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast]
  );
  const info = useCallback(
    (message: string) => addToast(message, "info"),
    [addToast]
  );
  const warning = useCallback(
    (message: string) => addToast(message, "warning"),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, info, warning };
}
