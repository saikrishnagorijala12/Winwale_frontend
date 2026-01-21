// src/components/contracts/EditContractModal.tsx
import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import {
  ClientContractRead,
  ClientContractUpdate,
  FormErrors,
} from "../../types/contract.types";
import { contractService } from "../../services/contractService";

interface EditContractModalProps {
  isOpen: boolean;
  contract: ClientContractRead | null;
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: ClientContractUpdate = {
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
};

export default function EditContractModal({
  isOpen,
  contract: initialContract,
  onClose,
  onSuccess,
}: EditContractModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [contract, setContract] =
    useState<ClientContractUpdate>(initialForm);
  const [clientId, setClientId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    if (isOpen && initialContract) {
      setContract({
        contract_number: initialContract.contract_number,
        contract_officer_name:
          initialContract.contract_officer_name || "",
        contract_officer_address:
          initialContract.contract_officer_address || "",
        contract_officer_city:
          initialContract.contract_officer_city || "",
        contract_officer_state:
          initialContract.contract_officer_state || "",
        contract_officer_zip:
          initialContract.contract_officer_zip || "",
        origin_country: initialContract.origin_country || "USA",
        gsa_proposed_discount:
          initialContract.gsa_proposed_discount || 0,
        q_v_discount: initialContract.q_v_discount || "",
        additional_concessions:
          initialContract.additional_concessions || "",
        normal_delivery_time:
          initialContract.normal_delivery_time || 30,
        expedited_delivery_time:
          initialContract.expedited_delivery_time || 10,
        fob_term: initialContract.fob_term || "Origin",
        energy_star_compliance:
          initialContract.energy_star_compliance || "Yes",
      });

      setClientId(initialContract.client_id);
      setStep(1);
      setErrors({});
    }
  }, [isOpen, initialContract]);

  /* ---------------- VALIDATION ---------------- */

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!contract.contract_number?.trim()) {
      newErrors.contract_number = "Contract number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT (SAME AS ADD MODAL) ---------------- */

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STEP 1 → move to step 2
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    // STEP 2 → update
    if (!clientId) {
      setErrors({ submit: "No client associated with this contract" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await contractService.updateContract(clientId, contract);
      handleClose();
      onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to update contract";

      setErrors({ submit: message });
      console.error("Error updating contract:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- CLOSE ---------------- */

  const handleClose = () => {
    setStep(1);
    setErrors({});
    onClose();
  };

  if (!isOpen || !initialContract) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] py-4 px-8 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Edit Contract</h2>
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
        <div className="flex items-center justify-center gap-4 p-4 bg-slate-50 border-b border-slate-200 shrink-0">
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
                    {completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      stepNum
                    )}
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

            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Contract Number *
                  </label>
                  <input
                    type="text"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border-2 ${
                      errors.contract_number
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-[#38A1DB]"
                    } outline-none`}
                    value={contract.contract_number}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        contract_number: e.target.value,
                      })
                    }
                  />
                  {errors.contract_number && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.contract_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Officer Name
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                    value={contract.contract_officer_name || ""}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        contract_officer_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Officer Address
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                    value={contract.contract_officer_address || ""}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        contract_officer_address: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                    value={contract.contract_officer_city || ""}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        contract_officer_city: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                      value={contract.contract_officer_state || ""}
                      onChange={(e) =>
                        setContract({
                          ...contract,
                          contract_officer_state: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      ZIP
                    </label>
                    <input
                      type="text"
                      className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                      value={contract.contract_officer_zip || ""}
                      onChange={(e) =>
                        setContract({
                          ...contract,
                          contract_officer_zip: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Origin Country
                  </label>
                  <input
                    type="text"
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                    value={contract.origin_country || ""}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        origin_country: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    FOB Term
                  </label>
                  <select
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
                    value={contract.fob_term || "Origin"}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        fob_term: e.target.value,
                      })
                    }
                  >
                    <option value="Origin">Origin</option>
                    <option value="Destination">Destination</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    GSA Proposed Discount (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                    value={contract.gsa_proposed_discount || 0}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        gsa_proposed_discount:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Energy Star Compliance
                  </label>
                  <select
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
                    value={contract.energy_star_compliance || "Yes"}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        energy_star_compliance: e.target.value,
                      })
                    }
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Normal Delivery (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                    value={contract.normal_delivery_time || 30}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        normal_delivery_time:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Expedited Delivery (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                    value={contract.expedited_delivery_time || 10}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        expedited_delivery_time:
                          parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Quantity / Volume Discounts
                  </label>
                  <textarea
                    rows={2}
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none resize-none"
                    value={contract.q_v_discount || ""}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        q_v_discount: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Additional Concessions
                  </label>
                  <textarea
                    rows={2}
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none resize-none"
                    value={contract.additional_concessions || ""}
                    onChange={(e) =>
                      setContract({
                        ...contract,
                        additional_concessions: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-200 shrink-0 z-20">
            <button
              type="button"
              onClick={() => {
                if (step === 1) handleClose();
                else setStep(1);
              }}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-[#38A1DB] text-white font-bold hover:bg-[#2D8BBF] shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && (
                <Loader2 className="w-5 h-5 animate-spin" />
              )}
              {step === 1 ? "Next" : "Update Contract"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
