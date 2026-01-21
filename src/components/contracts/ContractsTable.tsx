import React, { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
  MapPin,
  Calendar,
} from "lucide-react";
import { ClientContractRead } from "../../types/contract.types";

interface ContractTableProps {
  contracts: ClientContractRead[];
  loading: boolean;
  onView: (contract: ClientContractRead) => void;
  onEdit: (contract: ClientContractRead) => void;
  onDelete: (clientId: number) => void;
}

export default function ContractTable({
  contracts,
  loading,
  onView,
  onEdit,
  onDelete,
}: ContractTableProps) {
  const [openContractId, setOpenContractId] = useState<number | null>(null);

  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#38A1DB]" />
            <span className="text-slate-400 font-medium">
              Loading contracts...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="text-center py-20">
          <p className="text-slate-500 font-medium">No contracts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200  ">
      <div className="">
        <table className="w-full border-collapse">
          <thead className="">
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Contract
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Client
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Officer
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="w-16 px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {contracts.map((contract) => (
              <tr
                key={contract.client_profile_id}
                onClick={() => onView(contract)}
                className="group hover:bg-blue-50/30 cursor-pointer transition-all duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {contract.contract_number.slice(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm group-hover:text-[#38A1DB] transition-colors">
                        {contract.contract_number}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ID: #{contract.client_id}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-slate-700">
                    {contract.client}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600 font-medium">
                    {contract.contract_officer_name || (
                      <span className="text-slate-300">—</span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm">
                      {contract.contract_officer_city &&
                      contract.contract_officer_state
                        ? `${contract.contract_officer_city}, ${contract.contract_officer_state}`
                        : "Not set"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm">
                      {new Date(contract.updated_time).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenContractId(
                        openContractId === contract.client_id
                          ? null
                          : contract.client_id,
                      );
                    }}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>

                  {openContractId === contract.client_id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenContractId(null);
                        }}
                      />
                      <div
                        className="absolute right-12 top-10 z-50 w-52 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(contract);
                            setOpenContractId(null);
                          }}
                        >
                          <Eye className="w-4 h-4 " /> View
                          Details
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(contract);
                            setOpenContractId(null);
                          }}
                        >
                          <Edit className="w-4 h-4 " /> Edit
                          Contract
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button
                          className=" text-red-500 w-full px-4 py-3 text-left text-sm font-bold  hover:bg-slate-50 flex items-center gap-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(contract.client_id);
                            setOpenContractId(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete Contract
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
