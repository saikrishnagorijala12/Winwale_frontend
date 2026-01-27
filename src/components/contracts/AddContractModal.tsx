import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import {
  ClientContractCreate,
  ClientListRead,
  FormErrors,
} from "../../types/contract.types";
import { Step1, Step2 } from "./ContractFormSteps";
import { clientService } from "../../services/clientService";
import { contractService } from "../../services/contractService";

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: ClientContractCreate = {
  client_id: undefined,
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

export default function AddContractModal({
  isOpen,
  onClose,
  onSuccess,
}: AddContractModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [contract, setContract] = useState<ClientContractCreate>(initialForm);
  const [clients, setClients] = useState<ClientListRead[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (err) {
      console.error("Failed to load clients", err);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!contract.client_id) {
      newErrors.client_id = "You must select a client first";
    }
    if (!contract.contract_number?.trim()) {
      newErrors.contract_number = "Contract number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (!contract.client_id) {
      setErrors({ client_id: "Client selection is missing" });
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setShowClientDropdown(false);

    try {
      const { client_id, ...payload } = contract;

      const formattedPayload = {
        ...payload,
        origin_country: payload.origin_country || "USA",
        gsa_proposed_discount: Number(payload.gsa_proposed_discount) || 0,
        normal_delivery_time: Number(payload.normal_delivery_time) || 0,
        expedited_delivery_time: Number(payload.expedited_delivery_time) || 0,
      };

      await contractService.createContract(client_id!, formattedPayload);

      onSuccess();
      handleClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const status = err?.response?.status;

      if (status === 409) {
        setErrors({
          submit: detail || "This client already has an active contract.",
        });
      } else if (Array.isArray(detail)) {
        setErrors({
          submit: detail[0]?.msg || "Invalid data format provided.",
        });
      } else {
        setErrors({
          submit: detail || "An error occurred while creating the contract.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setContract(initialForm);
    setClientSearch("");
    setErrors({});
    onClose();
  };

  useEffect(() => {
    setErrors({});
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] py-5 px-8 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Create Contract</h2>
              <p className="text-blue-50 text-sm opacity-80">
                Setup a new contract profile for your client
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          {["Client & Officer", "Terms & Delivery"].map((label, i) => {
            const stepNum = (i + 1) as 1 | 2;
            const active = step >= stepNum;
            const completed = step > stepNum;

            return (
              <React.Fragment key={stepNum}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      active
                        ? "bg-[#38A1DB] text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {completed ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
                  </div>
                  <span
                    className={`font-semibold ${active ? "text-[#38A1DB]" : "text-slate-400"}`}
                  >
                    {label}
                  </span>
                </div>
                {i === 0 && (
                  <div
                    className={`w-16 h-1 rounded-full transition-colors ${completed ? "bg-[#38A1DB]" : "bg-slate-200"}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <form
          onSubmit={handleFormSubmit}
          noValidate
          className="flex-1 overflow-y-auto"
        >
          <div className="py-6 px-8 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {step === 1 && (
              <Step1
                contract={contract}
                onChange={setContract}
                clients={clients}
                clientSearch={clientSearch}
                setClientSearch={setClientSearch}
                showClientDropdown={showClientDropdown}
                setShowClientDropdown={setShowClientDropdown}
                errors={errors}
              />
            )}

            {step === 2 && (
              <Step2
                contract={contract}
                onChange={setContract}
                errors={errors}
              />
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (step === 1) handleClose();
                else setStep(1);
              }}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold hover:bg-[#2D8BBF] shadow-lg shadow-blue-200 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : step === 1 ? (
                "Next Step"
              ) : (
                "Create Contract Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
