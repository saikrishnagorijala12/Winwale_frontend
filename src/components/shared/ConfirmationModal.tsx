import React, { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Loader2, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  details?: Array<{ label: string; value: string }>;
  warning?: {
    message: string;
    type: "rose" | "amber" | "emerald";
  };
  confirmText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  variant?: "emerald" | "rose" | "amber" | "blue";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  details = [],
  warning,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isSubmitting = false,
  variant = "emerald",
}) => {
  if (!isOpen) return null;

  const bgColors = {
    emerald: "bg-emerald-500 hover:bg-emerald-600",
    rose: "bg-rose-500 hover:bg-rose-600",
    amber: "bg-amber-500 hover:bg-amber-600",
    blue: "bg-[#3399cc] hover:bg-[#2980b9]",
  };

  const warningColors = {
    rose: "bg-rose-50 border-rose-100 text-rose-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };

  const iconColors = {
    rose: "text-rose-500",
    amber: "text-amber-500",
    emerald: "text-emerald-500",
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 h-full">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className={`absolute top-6 right-6 transition-colors ${
            isSubmitting
              ? "text-slate-300 cursor-not-allowed"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <div className="text-slate-500 mb-6">{message}</div>

          {details.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-2 text-left">
              {details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-slate-500 shrink-0">
                    {detail.label}:
                  </span>
                  <span className="text-sm font-semibold text-slate-700 truncate text-right">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {warning && (
            <div
              className={`flex items-start gap-3 border rounded-2xl p-4 mb-6 text-left ${
                warningColors[warning.type]
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 ${iconColors[warning.type]}`}
              />
              <p className="text-xs font-medium leading-relaxed">
                {warning.message}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              disabled={isSubmitting}
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-sm flex items-center justify-center gap-2 ${bgColors[variant]} disabled:opacity-70`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
