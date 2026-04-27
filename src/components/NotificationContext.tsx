"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

type NotificationType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: NotificationType;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "primary";
  onConfirm: () => void;
}

interface NotificationContextType {
  showToast: (message: string, type?: NotificationType) => void;
  confirmAction: (options: ConfirmOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);

  const showToast = useCallback((message: string, type: NotificationType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const confirmAction = useCallback((options: ConfirmOptions) => {
    setConfirmOptions(options);
  }, []);

  const handleConfirm = () => {
    if (confirmOptions) {
      confirmOptions.onConfirm();
      setConfirmOptions(null);
    }
  };

  const handleCancel = () => {
    setConfirmOptions(null);
  };

  return (
    <NotificationContext.Provider value={{ showToast, confirmAction }}>
      {children}
      
      {/* Toasts Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="pointer-events-auto flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-right-full duration-300 min-w-[300px] max-w-md"
          >
            <div className={`shrink-0 ${
              toast.type === "success" ? "text-green-500" :
              toast.type === "error" ? "text-red-500" :
              toast.type === "warning" ? "text-yellow-500" : "text-cyan-500"
            }`}>
              {toast.type === "success" && <FaCheckCircle size={18} />}
              {toast.type === "error" && <FaExclamationTriangle size={18} />}
              {toast.type === "warning" && <FaExclamationTriangle size={18} />}
              {toast.type === "info" && <FaInfoCircle size={18} />}
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">{toast.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
              <FaTimes size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmOptions && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 mx-auto ${
              confirmOptions.type === "danger" ? "bg-red-100 dark:bg-red-500/10 text-red-500" : "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-500"
            }`}>
               <FaExclamationTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-4 tracking-tight">
              {confirmOptions.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center text-lg font-light mb-10 leading-relaxed">
              {confirmOptions.message}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleCancel}
                className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                {confirmOptions.cancelText || "Cancel"}
              </button>
              <button 
                onClick={handleConfirm}
                className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${
                  confirmOptions.type === "danger" ? "bg-red-500 hover:bg-red-600 shadow-red-500/25" : "bg-black dark:bg-white dark:text-black shadow-black/25"
                }`}
              >
                {confirmOptions.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
