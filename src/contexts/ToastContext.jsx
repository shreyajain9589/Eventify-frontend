import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef({});
  const lastToastRef = useRef({ message: "", timestamp: 0 });

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  const addToast = useCallback(
    (message, type = "info", duration = 5000) => {
      const now = Date.now();

      // PREVENT INFINITE LOOP (debounce same toast)
      if (
        lastToastRef.current.message === message &&
        now - lastToastRef.current.timestamp < 500
      ) {
        return; // Skip duplicate toast within 0.5 sec
      }

      lastToastRef.current = { message, timestamp: now };

      const id = now + Math.random();
      const toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        const timeout = setTimeout(() => removeToast(id), duration);
        timeoutsRef.current[id] = timeout;
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message, duration) => addToast(message, "success", duration),
    [addToast]
  );
  const error = useCallback(
    (message, duration) => addToast(message, "error", duration),
    [addToast]
  );
  const warning = useCallback(
    (message, duration) => addToast(message, "warning", duration),
    [addToast]
  );
  const info = useCallback(
    (message, duration) => addToast(message, "info", duration),
    [addToast]
  );

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      timeoutsRef.current = {};
    };
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
