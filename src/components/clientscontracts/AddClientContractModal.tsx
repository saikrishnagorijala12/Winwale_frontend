import React, { useState } from "react";
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { ClientFormData, ClientFormErrors } from "../../types/client.types";
import { ClientContractCreate, FormErrors } from "../../types/contract.types";
import { CompanyFormStep } from "../clients/CompanyFormStep";
import { ContactFormStep } from "../clients/ContactFormStep";
import {
  Step1 as ContractStep1,
  Step2 as ContractStep2,
} from "../contracts/ContractFormSteps";
import {
  validateStep1 as validateClientStep1,
  validateStep2 as validateClientStep2,
} from "../../utils/clientValidations";
import {
  validateStep1 as validateContractStep1,
  validateStep2 as validateContractStep2,
} from "../../utils/contractValidations";
import { getInitialFormData } from "../../utils/clientUtils";
import { contractService } from "../../services/contractService";
import api from "../../lib/axios";
import { toast } from "sonner";

interface AddClientContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = [
  "Company Info",
  "Negotiator Details",
  "Contract Info",
  "Terms & Delivery",
];

const initialContract: Omit<ClientContractCreate, "client_id"> = {
  contract_number: "",
  contract_officer_name: "",
  contract_officer_address: "",
  contract_officer_city: "",
  contract_officer_state: "",
  contract_officer_zip: "",
  origin_country: "USA",
  gsa_proposed_discount: 0,
  q_v_discount: "",
  additional_concessions: "",
  normal_delivery_time: 30,
  expedited_delivery_time: 10,
  fob_term: "Origin",
  energy_star_compliance: "Yes",
  is_deleted: false,
};

export default function AddClientContractModal({
  isOpen,
  onClose,
  onSuccess,
}: AddClientContractModalProps) {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] =
    useState<ClientFormData>(getInitialFormData());
  const [contractData, setContractData] = useState<ClientContractCreate>({
    ...initialContract,
    client_id: undefined,
  });
  const [clientErrors, setClientErrors] = useState<ClientFormErrors>({});
  const [contractErrors, setContractErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const handleClientChange = (field: keyof ClientFormData, value: string) => {
    setClientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearClientError = (field: keyof ClientFormErrors) => {
    setClientErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const valid = validateClientStep1(clientData, setClientErrors);
      if (valid) setStep(2);
    } else if (step === 2) {
      const result = validateClientStep2(clientData);
      if (!result.isValid) {
        setClientErrors((prev) => ({ ...prev, ...result.errors }));
        return;
      }
      setStep(3);
    } else if (step === 3) {
      const errors: FormErrors = {};
      const numErr = !contractData.contract_number
        ? "Contract number is required"
        : contractData.contract_number.length > 50
          ? "Contract Number must be at most 50 characters"
          : "";
      if (numErr) errors.contract_number = numErr;

      if (Object.keys(errors).length > 0) {
        setContractErrors(errors);
        return;
      }
      setContractErrors({});
      setStep(4);
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 4) return;

    const contractForValidation: ClientContractCreate = {
      ...contractData,
      client_id: 0,
    };
    const result = validateContractStep2(contractForValidation);
    if (!result.isValid) {
      setContractErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { logoFile, logoUrl, ...clientPayload } = clientData;
      const clientRes = await api.post("/clients", clientPayload);
      const newClientId: number = clientRes.data.client_id;

      // Upload logo if present
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append("file", logoFile);
        await api.post(`/clients/${newClientId}/logo`, logoFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const { client_id, ...contractPayload } = {
        ...contractData,
        client_id: newClientId,
        gsa_proposed_discount: Number(contractData.gsa_proposed_discount) || 0,
        normal_delivery_time: Number(contractData.normal_delivery_time) || 0,
        expedited_delivery_time:
          Number(contractData.expedited_delivery_time) || 0,
      };
      await contractService.createContract(newClientId, contractPayload);

      toast.success("Client & Contract created successfully");
      onSuccess();
      handleClose();
    } catch (err: any) {
      setSubmitError(err?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setClientData(getInitialFormData());
    setContractData({ ...initialContract, client_id: undefined });
    setClientErrors({});
    setContractErrors({});
    setSubmitError("");
    setClientSearch("");
    onClose();
  };

  if (!isOpen) return null;

  const isLastStep = step === 4;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-none z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 py-5 px-8 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-700">
                Add Client & Contract
              </h2>
              <p className="text-slate-500 text-sm opacity-80 mt-0.5">
                Set up a new client profile and their GSA contract
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Step bar */}
        <div className="flex items-center justify-between px-8 py-4 shrink-0 border-b border-slate-100 bg-white">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step >= stepNum;
            const isCompleted = step > stepNum;
            return (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center gap-1.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0 ${isActive
                      ? "bg-[#38A1DB] text-white shadow-md shadow-blue-200"
                      : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold text-center leading-tight ${isActive ? "text-[#38A1DB]" : "text-slate-400"
                      }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${step > stepNum ? "bg-[#38A1DB]" : "bg-slate-200"
                      }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form */}
        <form
          onSubmit={isLastStep ? handleSubmit : handleNext}
          noValidate
          className="flex-1 overflow-y-auto"
        >
          <div className="py-6 px-8 space-y-6">
            {submitError && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {step === 1 && (
              <CompanyFormStep
                formData={clientData}
                errors={clientErrors}
                onChange={handleClientChange}
                onClearError={handleClearClientError}
              />
            )}

            {step === 2 && (
              <ContactFormStep
                formData={clientData}
                errors={clientErrors}
                onChange={handleClientChange}
                onClearError={handleClearClientError}
              />
            )}

            {step === 3 && (
              <ContractStep1
                contract={contractData}
                onChange={setContractData}
                clients={[]}
                clientSearch={clientSearch}
                setClientSearch={setClientSearch}
                showClientDropdown={false}
                setShowClientDropdown={setShowClientDropdown}
                errors={contractErrors}
                hideClientField
              />
            )}

            {step === 4 && (
              <ContractStep2
                contract={contractData}
                onChange={setContractData}
                errors={contractErrors}
              />
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={step === 1 ? handleClose : handleBack}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : isLastStep ? (
                "Create Client & Contract"
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
