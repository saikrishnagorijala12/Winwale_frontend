import React, { useState } from "react";
import { X } from "lucide-react";
import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../../types/client.types";
import { FormStepper } from "./FormStepper";
import { CompanyFormStep } from "./CompanyFormStep";
import { ContactFormStep } from "./ContactFormStep";

interface ClientFormModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  formData: ClientFormData | EditingClient;
  errors: ClientFormErrors;
  backendError?: string;
  currentStep: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
  onChange: (field: keyof ClientFormData, value: string) => void;
  onClearError: (field: keyof ClientFormErrors) => void;
  onClearBackendError?: () => void;
  submitButtonText?: string;
  errorMessage?: string;
  onClearErrorMessage?: () => void;
}

const STEPS = ["Company Info", "Primary Contact"];

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  title,
  subtitle,
  formData,
  errors,
  backendError,
  currentStep,
  isSubmitting,
  onClose,
  onSubmit,
  onNext,
  onBack,
  onChange,
  onClearError,
  onClearBackendError,
  submitButtonText = "Create Client Profile",
}) => {

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(e);
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-none z-50 flex items-center justify-center p-4 h-full">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-br bg-slate-50 py-4 px-8 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-700">{title}</h2>
              <p className="text-slate-500 text-sm opacity-80">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Stepper */}
        <FormStepper currentStep={currentStep} steps={STEPS} />

        {backendError && (
          <div className="mx-8 mt-4 p-4 bg-red-50 border-l-4 border-red-500 ">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800">
                  {backendError}
                </p>
              </div>
              {onClearBackendError && (
                <button
                  type="button"
                  onClick={onClearBackendError}
                  className="ml-3 shrink-0 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="py-4 px-8 space-y-6">
            {currentStep === 1 && (
              <CompanyFormStep
                formData={formData}
                errors={errors}
                onChange={onChange}
                onClearError={onClearError}
              />
            )}

            {currentStep === 2 && (
              <ContactFormStep
                formData={formData}
                onChange={onChange}
                errors={errors}
                onClearError={onClearError}
              />
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={currentStep === 1 ? onClose : onBack}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </button>

            {currentStep === 1 ? (
              <button
                type="button"
                onClick={onNext}
                className="px-6 py-3 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                {isSubmitting ? "Processing..." : submitButtonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
