import React from "react";
import {
  X,
  FileText,
  User,
  MapPin,
  Settings,
  ShieldCheck,
  Info,
  Edit,
} from "lucide-react";
import { ClientContractRead } from "../../types/contract.types";

interface ContractDetailsModalProps {
  contract: ClientContractRead | null;
  onClose: () => void;
  onEdit: (contract: ClientContractRead) => void;
}

export default function ContractDetailsModal({
  contract,
  onClose,
  onEdit,
}: ContractDetailsModalProps) {
  if (!contract) return null;

  const ContactRow = ({ icon: Icon, value }: { icon: any; value: any }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3 text-slate-600">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-sm">{value}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40  z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-br px-8 py-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-18 h-18 rounded-2xl bg-[#38A1DB]/20 backdrop-blur flex items-center justify-center shadow-inner text-[#38A1DB]">
                  <FileText className="w-7 h-7" />
                </div>
              </div>
              <div>
                <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-1">
                  Contract Details
                </p>
                <h2 className="text-2xl font-bold text-slate-700 tracking-tight">
                  {contract.contract_number}
                </h2>
                <p className="text-sm md:text-base text-blue-100 font-medium mt-1">
                  <span className="font-semibold text-slate-500">
                    {contract.client || "—"}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-white/20 transition-colors text-slate-700"
            >
              <X className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-6">
          <div className="bg-linear-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#38A1DB]" />
              <h3 className="text-xl font-bold text-slate-800">
                Contract Officer
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Officer Name
                </label>
                <p className="text-slate-800 font-semibold mt-1">
                  {contract.contract_officer_name || "—"}
                </p>
              </div>
              <ContactRow
                icon={MapPin}
                value={`${contract.contract_officer_address || ""}, ${
                  contract.contract_officer_city || ""
                }, ${contract.contract_officer_state || ""} ${
                  contract.contract_officer_zip || ""
                }`
                  .trim()
                  .replace(/^,\s*/, "")
                  .replace(/,\s*,/g, ",")}
              />
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-[#38A1DB]" />
              <h3 className="text-xl font-bold text-slate-800">
                Terms & Logistics
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-sm text-slate-500 font-medium uppercase tracking-tight">
                  FOB Term
                </span>
                <span className="font-bold text-slate-800">
                  {contract.fob_term}
                </span>
              </div>
              {/* <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-sm text-slate-500 font-medium uppercase tracking-tight">
                  GSA Discount
                </span>
                <span className="font-bold text-[#38A1DB]">
                  {contract.gsa_proposed_discount}%
                </span>
              </div> */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Normal Deliv.
                  </label>
                  <p className="text-sm font-bold text-slate-700">
                    {contract.normal_delivery_time} Days
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Expedited
                  </label>
                  <p className="text-sm font-bold text-slate-700">
                    {contract.expedited_delivery_time} Days
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Energy Star Compliance
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      contract.energy_star_compliance === "Yes"
                        ? "text-emerald-500"
                        : "text-slate-300"
                    }`}
                  />
                  <span className="text-sm font-bold text-slate-700">
                    {contract.energy_star_compliance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-slate-400" />
              <h3 className="text-xl font-bold text-slate-800">
                Additional Terms
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Additional Concessions
                </label>
                <p className="text-slate-700 mt-2 text-sm leading-relaxed">
                  {contract.additional_concessions || "None specified"}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Q/V Discount Details
                </label>
                <p className="text-slate-700 mt-2 text-sm leading-relaxed">
                  {contract.q_v_discount || "None specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-3xl flex justify-between border-t border-slate-100 z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(contract);
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl
             bg-linear-to-br from-[#38A1DB] to-[#2D8BBF]
             text-white font-bold shadow-lg hover:shadow-xl
             transition-all active:scale-95"
          >
            <Edit className="w-4 h-4 stroke-[2.5px]" />
            Edit Contract
          </button>
        </div>
      </div>
    </div>
  );
}
