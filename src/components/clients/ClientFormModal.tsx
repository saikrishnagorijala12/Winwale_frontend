// components/clients/ClientFormModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import { ClientFormData, ClientFormErrors, EditingClient } from '../../types/client.types';
import { FormStepper } from './FormStepper';
import { CompanyFormStep } from './CompanyFormStep';
import { ContactFormStep } from './ContactFormStep';

interface ClientFormModalProps {
  isOpen: boolean;
  title: string;
  formData: ClientFormData | EditingClient;
  errors: ClientFormErrors;
  currentStep: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
  onChange: (field: keyof ClientFormData, value: string) => void;
  onClearError: (field: keyof ClientFormErrors) => void;
  submitButtonText?: string;
}

const STEPS = ["Company Info", "Primary Contact"];

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  title,
  formData,
  errors,
  currentStep,
  isSubmitting,
  onClose,
  onSubmit,
  onNext,
  onBack,
  onChange,
  onClearError,
  submitButtonText = "Create Client Profile",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-none z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] py-4 px-8 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Stepper */}
        <FormStepper currentStep={currentStep} steps={STEPS} />

        {/* Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
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
              <ContactFormStep formData={formData} onChange={onChange} />
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-200 shrink-0">
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
                className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold"
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