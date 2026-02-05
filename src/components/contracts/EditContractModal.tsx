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
  const [formData, setFormData] = useState<ClientContractUpdate>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen && initialContract) {
      setFormData({
        contract_number: initialContract.contract_number || "",
        contract_officer_name: initialContract.contract_officer_name || "",
        contract_officer_address:
          initialContract.contract_officer_address || "",
        contract_officer_city: initialContract.contract_officer_city || "",
        contract_officer_state: initialContract.contract_officer_state || "",
        contract_officer_zip: initialContract.contract_officer_zip || "",
        origin_country: initialContract.origin_country || "USA",
        gsa_proposed_discount: initialContract.gsa_proposed_discount || 0,
        q_v_discount: initialContract.q_v_discount || "",
        additional_concessions: initialContract.additional_concessions || "",
        normal_delivery_time: initialContract.normal_delivery_time || 30,
        expedited_delivery_time: initialContract.expedited_delivery_time || 10,
        fob_term: initialContract.fob_term || "Origin",
        energy_star_compliance: initialContract.energy_star_compliance || "Yes",
      });
      setStep(1);
      setErrors({});
    }
  }, [isOpen, initialContract]);

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.contract_number?.trim()) {
      newErrors.contract_number = "Contract number is required";
    } else if (formData.contract_number.length > 50) {
      newErrors.contract_number = "Max 50 characters allowed";
    }

    if (formData.contract_officer_name?.length > 30) {
      newErrors.contract_officer_name = "Max 30 characters allowed";
    }

    if (formData.contract_officer_address?.length > 50) {
      newErrors.contract_officer_address = "Max 50 characters allowed";
    }

    if (formData.contract_officer_city?.length > 50) {
      newErrors.contract_officer_city = "Max 50 characters allowed";
    }

    if (formData.contract_officer_state?.length > 50) {
      newErrors.contract_officer_state = "Max 50 characters allowed";
    }

    if (
      formData.contract_officer_zip &&
      !/^[A-Za-z0-9]{1,7}$/.test(formData.contract_officer_zip)
    ) {
      newErrors.contract_officer_zip =
        "ZIP must be alphanumeric and max 7 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.origin_country?.length > 50) {
      newErrors.origin_country = "Max 50 characters allowed";
    }

    if (
      formData.gsa_proposed_discount < 0 ||
      formData.gsa_proposed_discount > 100.00
    ) {
      newErrors.gsa_proposed_discount = "Discount must be between 0 and 100.00";
    }

    if (formData.q_v_discount?.length > 50) {
      newErrors.q_v_discount = "Max 50 characters allowed";
    }

    if (formData.additional_concessions?.length > 50) {
      newErrors.additional_concessions = "Max 50 characters allowed";
    }

    if (
      !Number.isInteger(formData.normal_delivery_time) ||
      formData.normal_delivery_time < 0
    ) {
      newErrors.normal_delivery_time =
        "Normal delivery time must be a positive number";
    }

    if (
      !Number.isInteger(formData.expedited_delivery_time) ||
      formData.expedited_delivery_time < 0
    ) {
      newErrors.expedited_delivery_time =
        "Expedited delivery time must be a positive number";
    }

    if (!formData.fob_term) {
      newErrors.fob_term = "FOB term is required";
    }

    if (!formData.energy_star_compliance) {
      newErrors.energy_star_compliance = "Energy Star compliance is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }

    if (!validateStep2()) {
      return;
    }

    if (!initialContract?.client_id) {
      setErrors({ submit: "Missing Client ID. Cannot update." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: ClientContractUpdate = {
        ...formData,
        contract_number: formData.contract_number.trim(),
        origin_country: formData.origin_country?.trim() || "USA",
        gsa_proposed_discount: Number(formData.gsa_proposed_discount) || 0,
        normal_delivery_time: Number(formData.normal_delivery_time) || 0,
        expedited_delivery_time: Number(formData.expedited_delivery_time) || 0,
      };

      await contractService.updateContract(initialContract.client_id, payload);
      onSuccess();
      handleClose();
    } catch (err: any) {
      const backendError = err?.response?.data?.detail;

      if (Array.isArray(backendError)) {
        setErrors({ submit: backendError[0]?.msg || "Validation error" });
      } else {
        setErrors({ submit: backendError || "An unexpected error occurred" });
      }
      console.error("Update Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrors({});
    onClose();
  };

  if (!isOpen || !initialContract) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-slate-50 py-4 px-8 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold  text-slate-700">Edit Contract</h2>
              <p className="text-slate-500 text-sm">
                Update contract details for {initialContract.client}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 p-4 shrink-0">
          {["Contract & Officer", "Terms & Delivery"].map((label, i) => {
            const stepNum = (i + 1) as 1 | 2;
            const isActive = step >= stepNum;
            const isCompleted = step > stepNum;
            return (
              <React.Fragment key={stepNum}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      isActive
                        ? "bg-[#38A1DB] text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`font-semibold ${isActive ? "text-[#38A1DB]" : "text-slate-400"}`}
                  >
                    {label}
                  </span>
                </div>
                {i === 0 && (
                  <div
                    className={`w-16 h-1 rounded-full ${step > 1 ? "bg-[#38A1DB]" : "bg-slate-200"}`}
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
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm font-semibold">{errors.submit}</p>
              </div>
            )}

            {step === 1 ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Contract Number *
                  </label>
                  <input
                    type="text"
                    className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                      errors.contract_number
                        ? "border-red-300 focus:border-red-500 bg-red-50/30"
                        : "border-slate-200 focus:border-[#38A1DB]"
                    }`}
                    value={formData.contract_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contract_number: e.target.value,
                      })
                    }
                  />
                  {errors.contract_number && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
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
                    value={formData.contract_officer_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
                    value={formData.contract_officer_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
                    value={formData.contract_officer_city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contract_officer_city: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none"
                      value={formData.contract_officer_state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                      value={formData.contract_officer_zip}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contract_officer_zip: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    FOB Term
                  </label>
                  <select
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
                    value={formData.fob_term}
                    onChange={(e) =>
                      setFormData({ ...formData, fob_term: e.target.value })
                    }
                  >
                    <option value="Origin">Origin</option>
                    <option value="Destination">Destination</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Energy Star
                  </label>
                  <select
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none bg-white"
                    value={formData.energy_star_compliance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
                    value={formData.normal_delivery_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        normal_delivery_time: parseInt(e.target.value) || 0,
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
                    value={formData.expedited_delivery_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expedited_delivery_time: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">
                    Quantity Discounts
                  </label>
                  <textarea
                    rows={2}
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] outline-none resize-none"
                    value={formData.q_v_discount}
                    onChange={(e) =>
                      setFormData({ ...formData, q_v_discount: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-slate-50 p-6 flex justify-between border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={() => (step === 1 ? handleClose() : setStep(1))}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : step === 1 ? (
                "Next"
              ) : (
                "Update Contract"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
