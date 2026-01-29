import React, { useState } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { ClientContractRead } from "../../types/contract.types";

interface ContractTableProps {
  contracts: ClientContractRead[];
  loading: boolean;
  onView: (contract: ClientContractRead) => void;
  onEdit: (contract: ClientContractRead) => void;
  onDelete: (clientId: number) => void;
  // Pagination Props
  currentPage: number;
  totalContracts: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function ContractTable({
  contracts,
  loading,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalContracts,
  itemsPerPage,
  onPageChange,
}: ContractTableProps) {
  const [openContractId, setOpenContractId] = useState<number | null>(null);

  const totalPages = Math.ceil(totalContracts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const EmptyState = () => (
    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
        <Inbox className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-base font-bold text-slate-500">No contracts found</h3>
      
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 ">
      {/*DESKTOP TABLE  */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contract</th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Officer</th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Location</th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Modified</th>
              <th className="w-16 px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                    <p className="text-sm text-slate-500 font-medium">Loading contracts...</p>
                  </div>
                </td>
              </tr>
            ) : contracts.length === 0 ? (
              <tr>
                <td colSpan={6}><EmptyState /></td>
              </tr>
            ) : (
              contracts.map((contract) => (
                <tr
                  key={contract.client_profile_id}
                  onClick={() => onView(contract)}
                  className="group hover:bg-blue-50/30 cursor-pointer transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-[#38A1DB] transition-colors">{contract.contract_number}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {contract.client.slice(0, 2).toLocaleUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm transition-colors">{contract.client}</span>
                        <span className="text-[11px] text-slate-400 font-medium">ID: #{contract.client_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600 font-medium">
                      {contract.contract_officer_name || <span className="text-slate-300">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm truncate max-w-37.5">
                        {contract.contract_officer_city ? `${contract.contract_officer_city}, ${contract.contract_officer_state}` : "Not set"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm">
                        {new Date(contract.updated_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenContractId(openContractId === contract.client_id ? null : contract.client_id);
                      }}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                    {openContractId === contract.client_id && (
                       <ContractActionMenu 
                        onView={() => onView(contract)} 
                        onEdit={() => onEdit(contract)} 
                        onDelete={() => onDelete(contract.client_id)}
                        onClose={() => setOpenContractId(null)}
                       />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS  */}
      <div className="md:hidden divide-y divide-slate-100">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#24578f]" />
          </div>
        ) : contracts.length === 0 ? (
          <EmptyState />
        ) : (
          contracts.map((contract) => (
            <div key={contract.client_profile_id} onClick={() => onView(contract)} className="p-5 hover:bg-blue-50/50 transition active:bg-blue-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] flex items-center justify-center text-white font-bold text-lg shadow-blue-100 shadow-lg">
                    {contract.contract_number.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{contract.contract_number}</h3>
                    <p className="text-xs text-slate-500 font-medium">{contract.client}</p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenContractId(openContractId === contract.client_id ? null : contract.client_id);
                    }}
                    className="p-2 border border-slate-200 rounded-xl bg-white shadow-sm"
                  >
                    <MoreVertical className="w-5 h-5 text-slate-500" />
                  </button>
                  {openContractId === contract.client_id && (
                    <ContractActionMenu 
                      onView={() => onView(contract)} 
                      onEdit={() => onEdit(contract)} 
                      onDelete={() => onDelete(contract.client_id)}
                      onClose={() => setOpenContractId(null)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Officer</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{contract.contract_officer_name || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Modified</p>
                  <p className="text-xs font-semibold text-slate-800">
                    {new Date(contract.updated_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={12} className="text-slate-400" />
                    <p className="text-xs font-semibold text-slate-800">
                       {contract.contract_officer_city ? `${contract.contract_officer_city}, ${contract.contract_officer_state}` : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===================== PAGINATION ===================== */}
      {!loading && totalContracts > itemsPerPage && (
        <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-semibold">{startIndex + 1}</span> to{" "}
            <span className="text-slate-900 font-semibold">{Math.min(startIndex + itemsPerPage, totalContracts)}</span> of{" "}
            <span className="text-slate-900 font-semibold">{totalContracts}</span> contracts
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, idx) => (
                <React.Fragment key={idx}>
                  {pageNum === "..." ? (
                    <span className="px-2 text-slate-400 font-medium">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(Number(pageNum))}
                      className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                        ${currentPage === pageNum
                          ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Internal Action Menu Component to keep the main table cleaner
const ContractActionMenu = ({ onView, onEdit, onDelete, onClose }: any) => (
  <>
    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); onClose(); }} />
    <div className="absolute right-12 top-10 z-50 w-52 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in duration-100" onClick={(e) => e.stopPropagation()}>
      <button className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3" onClick={() => { onView(); onClose(); }}>
        <Eye className="w-4 h-4 text-slate-400" /> View Details
      </button>
      <button className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3" onClick={() => { onEdit(); onClose(); }}>
        <Edit className="w-4 h-4 text-slate-400" /> Edit Contract
      </button>
      <div className="h-px bg-slate-100 my-1" />
      <button className="text-red-500 w-full px-4 py-3 text-left text-sm font-bold hover:bg-slate-50 flex items-center gap-3" onClick={() => { onDelete(); onClose(); }}>
        <Trash2 className="w-4 h-4" /> Delete Contract
      </button>
    </div>
  </>
);