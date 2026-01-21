// src/components/contracts/AddContractModal.tsx
import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
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

    if (!contract.contract_number?.trim()) {
      newErrors.contract_number = "Contract number is required";
    }

    if (!contract.client_id) {
      newErrors.client_id = "Please select a client";
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
      setErrors({ client_id: "Please select a client" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setShowClientDropdown(false);

    try {
      const { client_id, ...payload } = contract;
      await contractService.createContract(client_id!, payload);
      handleClose();
      onSuccess();
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;

      if (status === 400) {
        setErrors({
          submit: detail || "Contract already exists for this client",
        });
        return;
      }

      setErrors({
        submit: detail || "Failed to create contract",
      });
    }
    finally {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60  z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] py-4 px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Add Contract</h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* STEPS */}
        <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 border-b border-slate-200">
          {["Officer Info", "Logistics & Terms"].map((label, i) => {
            const stepNum = (i + 1) as 1 | 2;
            const active = step >= stepNum;
            const completed = step > stepNum;

            return (
              <div key={stepNum} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      active
                        ? "bg-[#38A1DB] text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {completed ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
                  </div>
                  <span
                    className={`font-semibold ${
                      active ? "text-[#38A1DB]" : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i === 0 && (
                  <div
                    className={`w-16 h-1 rounded-full ${
                      completed ? "bg-[#38A1DB]" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleFormSubmit}
          noValidate
          className="flex-1 overflow-y-auto"
        >
          <div className="py-4 px-8 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-800">
                  {errors.submit}
                </p>
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

          {/* FOOTER */}
          <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                if (step === 1) handleClose();
                else setStep(1);
              }}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100"
              disabled={isSubmitting}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold hover:bg-[#2D8BBF] shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {step === 1 ? "Next" : "Create Contract Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
