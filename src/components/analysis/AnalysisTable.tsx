import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  FileText,
  SortAsc,
  SortDesc,
  Building2,
  Clock,
  MoreVertical,
  Eye,
} from "lucide-react";
import ModificationsSummary from "./ModificationsSummary";
import AnalysisActionsMenu from "./AnalysisActionsMenu";
import Pagination from "./Pagination";
import { useAnalysis } from "../../context/AnalysisContext";
import { normalizeStatus } from "../../utils/statusUtils";
import StatusBadge from "../shared/StatusBadge";
import { formatDateTime } from "../../utils/analysisUtils";
import {
  AnalysisJob,
  SortConfig,
  StatusFilter,
} from "../../types/analysis.types";

interface AnalysisTableProps {
  analysisHistory: AnalysisJob[];
  totalItems: number;
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  updatingId: number | null;
  onUpdateStatus: (jobId: number, action: "approve" | "reject") => void;
}

export default function AnalysisTable({
  analysisHistory,
  totalItems,
  loading,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  sortConfig,
  onSort,
  updatingId,
  onUpdateStatus,
}: AnalysisTableProps) {
  const navigate = useNavigate();
  const { setSelectedJobId } = useAnalysis();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Analysis ID
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Modifications
                </th>
                <th
                  className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => onSort("date")}
                >
                  <div className="flex items-center gap-1">Date & Time</div>
                </th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Analyzed By
                </th>
                <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                      <p className="text-sm text-slate-500 font-medium">
                        Loading Analysis History...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : analysisHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <p className="font-bold text-slate-500 mb-2">
                      No analyses found
                    </p>
                  </td>
                </tr>
              ) : (
                analysisHistory.map((item) => {
                  const hasModifications =
                    item.summary.additions > 0 ||
                    item.summary.deletions > 0 ||
                    item.summary.priceIncreases > 0 ||
                    item.summary.priceDecreases > 0 ||
                    item.summary.descriptionChanges > 0;

                  return (
                    <tr
                      key={item.job_id}
                      onClick={() => {
                        navigate(`/analyses/details?id=${item.job_id}`);
                      }}
                      className="cursor-pointer group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-[#38A1DB] transition-colors">
                          ANAL-JOB-{item.job_id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10">
                            <Building2 className="h-4 w-4 text-[#24578f]" />
                          </div>

                          <div className="leading-tight">
                            <span className="block text-sm uppercase font-semibold text-slate-800">
                              {item.client || "—"}
                            </span>
                            <span className="text-[12px] font-medium text-slate-500">
                              {item.contract_number || "No Contract"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-slate-500 font-medium text-sm">
                          <StatusBadge status={item.status} />
                        </span>
                      </td>
                      <td className="p-4">
                        <ModificationsSummary
                          summary={item.summary}
                          hasModifications={hasModifications}
                        />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <div className="leading-tight">
                            <div className="text-sm font-medium">
                              {formatDateTime(item.created_time)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 text-slate-500 text-sm transition-colors">
                          {item.user}
                        </span>
                      </td>

                      <td className="p-4 relative">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === item.job_id ? null : item.job_id,
                              );
                            }}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openMenuId === item.job_id && (
                            <AnalysisActionsMenu
                              item={item}
                              updatingId={updatingId}
                              onUpdateStatus={onUpdateStatus}
                              onClose={() => setOpenMenuId(null)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalItems > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
          />
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="block lg:hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
              <p className="text-sm text-slate-500 font-medium">
                Loading Analysis History...
              </p>
            </div>
          </div>
        ) : analysisHistory.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="font-bold text-slate-500 mb-2">No analyses found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {analysisHistory.map((item) => {
              const hasModifications =
                item.summary.additions > 0 ||
                item.summary.deletions > 0 ||
                item.summary.priceIncreases > 0 ||
                item.summary.priceDecreases > 0 ||
                item.summary.descriptionChanges > 0;

              return (
                <div
                  key={item.job_id}
                  onClick={() => {
                    navigate(`/analyses/details?id=${item.job_id}`);
                  }}
                  className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  {/* Header: ID and Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-sm mb-1">
                        ANAL-JOB-{item.job_id}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(item.created_time)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === item.job_id ? null : item.job_id,
                          );
                        }}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openMenuId === item.job_id && (
                        <AnalysisActionsMenu
                          item={item}
                          updatingId={updatingId}
                          onUpdateStatus={onUpdateStatus}
                          onClose={() => setOpenMenuId(null)}
                        />
                      )}
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="leading-tight min-w-0 flex-1">
                      <div className="font-semibold text-slate-800 truncate">
                        {item.client || "—"}
                      </div>
                      <div className="text-xs font-medium text-slate-500 truncate">
                        {item.contract_number || "No Contract"}
                      </div>
                    </div>
                  </div>

                  {/* Modifications Summary */}
                  <div className="mb-2">
                    <ModificationsSummary
                      summary={item.summary}
                      hasModifications={hasModifications}
                    />
                  </div>

                  {/* Analyzed By */}
                  <div className="text-xs text-slate-500">
                    Analyzed by{" "}
                    <span className="font-medium text-slate-700">
                      {item.user}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalItems > itemsPerPage && (
          <div className="border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
}
