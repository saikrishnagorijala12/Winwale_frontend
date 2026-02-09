import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  FileEdit,
  Loader2,
  SortAsc,
  SortDesc,
  MoreVertical,
} from "lucide-react";
import {
  normalizeStatus,
  STATUS_BADGE_BASE,
  STATUS_MAP,
} from "../utils/statusUtils";

const formatDateTime = (dateString: string) => {
  if (!dateString) return "—";

  const date = new Date(dateString);

  return date.toLocaleTimeString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function AnalysisHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modificationFilter, setModificationFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");

  const [selectedClient, setSelectedClient] = useState("All Clients");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const clientOptions = Array.from(
    new Set(analysisHistory.map((a) => a.client).filter(Boolean)),
  );
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const processModifications = (actions: any[]) => {
    const summary = {
      additions: 0,
      deletions: 0,
      priceIncreases: 0,
      priceDecreases: 0,
      descriptionChanges: 0,
    };

    if (!actions || !Array.isArray(actions)) return summary;

    actions.forEach((a) => {
      switch (a.action_type) {
        case "NEW_PRODUCT":
          summary.additions++;
          break;
        case "REMOVED_PRODUCT":
          summary.deletions++;
          break;
        case "PRICE_INCREASE":
          summary.priceIncreases++;
          break;
        case "PRICE_DECREASE":
          summary.priceDecreases++;
          break;
        case "DESCRIPTION_CHANGE":
          summary.descriptionChanges++;
          break;
        default:
          break;
      }
    });

    return summary;
  };

  const getStatusBadge = (status: string) => {
    const slug = normalizeStatus(status);

    if (slug === "unknown") {
      return (
        <span
          className={`${STATUS_BADGE_BASE} bg-slate-100 text-slate-700 border-slate-200`}
        >
          Unknown
        </span>
      );
    }

    const { label, styles, icon: Icon } = STATUS_MAP[slug];

    return (
      <span className={`${STATUS_BADGE_BASE} ${styles}`}>
        <Icon className="w-3 h-3 stroke-[2.5px]" />
        <span className="hidden sm:inline">{label}</span>
      </span>
    );
  };

  const fetchAnalysisHistory = async () => {
    console.log("fetchAnalysisHistory called");

    try {
      setLoading(true);
      const response = await api.get("/jobs");

      const formattedData = response.data.map((job: any) => ({
        ...job,
        summary: processModifications(job.modifications_actions),
      }));

      setAnalysisHistory(formattedData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClient, dateFrom, dateTo]);

  const handleUpdateStatus = async (
    jobId: number,
    action: "approve" | "reject",
  ) => {
    try {
      setUpdatingId(jobId);

      await api.post(`/jobs/${jobId}/status?action=${action}`);

      toast.success(
        `Analysis ${action === "approve" ? "approved" : "rejected"} successfully`,
      );

      setAnalysisHistory((prev) =>
        prev.map((job) =>
          job.job_id === jobId
            ? { ...job, status: action === "approve" ? "approved" : "rejected" }
            : job,
        ),
      );
    } catch (error: any) {
      console.error("Status update failed:", error);
      toast.error(error.response?.data?.detail || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredAndSortedHistory = [...analysisHistory]
    .filter((item) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        !q ||
        item.job_id?.toString().includes(q) ||
        item.client?.toLowerCase().includes(q) ||
        item.user?.toLowerCase().includes(q) ||
        item.contract?.toLowerCase().includes(q);

      const matchesClient =
        clientFilter === "All" || item.client === clientFilter;

      const matchesStatus =
        statusFilter === "All" || normalizeStatus(item.status) === statusFilter;

      const createdAt = new Date(item.created_time).getTime();

      const matchesDateFrom =
        !dateFrom || createdAt >= new Date(dateFrom).getTime();

      const matchesDateTo = !dateTo || createdAt <= new Date(dateTo).getTime();

      return (
        matchesSearch &&
        matchesClient &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo
      );
    })
    .sort((a, b) => {
      if (sortConfig.key === "date") {
        const aTime = new Date(a.created_time).getTime();
        const bTime = new Date(b.created_time).getTime();
        return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
      }
      return 0;
    });

  const totalItems = filteredAndSortedHistory.length;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedHistory = filteredAndSortedHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedClient("All Clients");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleGenerate = (jobId: any) => {
    navigate(`/documents?job_id=${jobId}`);
  };

  const handleDownloadHistory = () => {
    navigate("/downloads");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 mx-auto">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Analysis History
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            View and manage all past price list analyses
          </p>
        </div>

        {/* <button
          onClick={handleDownloadHistory}
          className="flex items-center justify-center gap-2 bg-[#38A1DB] hover:bg-[#2D8BBF] text-white px-7 py-3 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
        >
          Download History
        </button> */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#3399cc]" />
            <h2 className="text-sm font-bold text-slate-800">Filters</h2>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm font-semibold text-[#3399cc] hover:underline"
          >
            Clear all
          </button>
        </div>

        {/* Inputs */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, client, or contract..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Client */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Client
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full text-slate-500 appearance-none pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all text-sm font-medium"
                >
                  <option value="All">All Clients</option>
                  {clientOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Status
              </label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-slate-500 appearance-none pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all text-sm font-medium"
                >
                  <option value="All">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Date Range
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateFrom ? dateFrom.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setDateFrom(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                    className="w-full text-slate-500 px-4 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateTo ? dateTo.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                      setDateTo(
                        e.target.value ? new Date(e.target.value) : undefined,
                      )
                    }
                    className="w-full text-slate-500 px-4 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#3399cc]/10 focus:border-[#3399cc] outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-0">
          <div className="overflow-x-auto">
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
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date & Time
                      {sortConfig.key === "date" &&
                        (sortConfig.direction === "asc" ? (
                          <SortAsc className="w-3 h-3 stroke-[2.5px] text-slate-400" />
                        ) : (
                          <SortDesc className="w-3 h-3 text-slate-400" />
                        ))}
                    </div>
                  </th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                        <p className="text-sm text-slate-500 font-medium">
                          Loading Analysis History...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <p className="text-lg font-bold text-slate-800 mb-2">
                        No analyses found
                      </p>
                      <p className="text-slate-500">
                        Try adjusting your search query
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedHistory.map((item) => {
                    const hasModifications =
                      item.summary.additions > 0 ||
                      item.summary.deletions > 0 ||
                      item.summary.priceIncreases > 0 ||
                      item.summary.priceDecreases > 0 ||
                      item.summary.descriptionChanges > 0;

                    return (
                      <tr
                        key={item.job_id}
                        onClick={() => navigate(`/analyses/${item.job_id}`)}
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
                              <span className="block font-semibold text-slate-800">
                                {item.client || "—"}
                              </span>
                              <span className="text-xs font-medium text-slate-500">
                                ({item.contract_number || "No Contract"})
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-500 font-medium text-sm">
                            {getStatusBadge(item.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            {item.summary.additions > 0 && (
                              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                <Plus className="w-3 h-3" />
                                {item.summary.additions}
                              </span>
                            )}

                            {item.summary.deletions > 0 && (
                              <span className="flex items-center gap-1 text-rose-500 font-bold">
                                <Minus className="w-3 h-3" />
                                {item.summary.deletions}
                              </span>
                            )}

                            {item.summary.priceIncreases > 0 && (
                              <span className="flex items-center gap-1 text-amber-600 font-bold">
                                <TrendingUp className="w-3 h-3" />
                                {item.summary.priceIncreases}
                              </span>
                            )}

                            {item.summary.priceDecreases > 0 && (
                              <span className="flex items-center gap-1 text-blue-600 font-bold">
                                <TrendingDown className="w-3 h-3" />
                                {item.summary.priceDecreases}
                              </span>
                            )}

                            {item.summary.descriptionChanges > 0 && (
                              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                                <FileEdit className="w-3 h-3" />
                                {item.summary.descriptionChanges}
                              </span>
                            )}

                            {!hasModifications && (
                              <span className="text-slate-400 text-xs italic">
                                No modifications
                              </span>
                            )}
                          </div>
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

                        <td className="p-4 relative">
                          <div className="flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(
                                  openMenuId === item.job_id
                                    ? null
                                    : item.job_id,
                                );
                              }}
                              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === item.job_id && (
                              <div
                                className="absolute right-12 top-4 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenerate(item.job_id);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                              >
                                <FileText className="w-4 h-4 text-slate-400" />
                                Generate Docs
                              </button> */}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/analyses/${item.job_id}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                                >
                                  <Eye className="w-4 h-4 text-slate-400" />
                                  View Details
                                </button>

                                {normalizeStatus(item.status) === "pending" && (
                                  <>
                                    <div className="my-1 border-t border-slate-100" />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(
                                          item.job_id,
                                          "approve",
                                        );
                                        setOpenMenuId(null);
                                      }}
                                      disabled={updatingId === item.job_id}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors font-semibold disabled:opacity-50"
                                    >
                                      {updatingId === item.job_id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <CheckCircle2 className="w-4 h-4" />
                                      )}
                                      Approve Analysis
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateStatus(
                                          item.job_id,
                                          "reject",
                                        );
                                        setOpenMenuId(null);
                                      }}
                                      disabled={updatingId === item.job_id}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold disabled:opacity-50"
                                    >
                                      {updatingId === item.job_id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <XCircle className="w-4 h-4" />
                                      )}
                                      Reject Analysis
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {totalItems > itemsPerPage && (
              <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500 font-medium">
                  Showing{" "}
                  <span className="text-slate-900 font-semibold">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-slate-900 font-semibold">
                    {Math.min(startIndex + itemsPerPage, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="text-slate-900 font-semibold">
                    {totalItems}
                  </span>{" "}
                  analyses
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const totalPages = Math.ceil(totalItems / itemsPerPage);
                      const pages = [];
                      const delta = 1;
                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 ||
                          i === totalPages ||
                          (i >= currentPage - delta && i <= currentPage + delta)
                        ) {
                          pages.push(i);
                        } else if (pages[pages.length - 1] !== "...") {
                          pages.push("...");
                        }
                      }
                      return pages.map((pageNum, idx) => (
                        <React.Fragment key={idx}>
                          {pageNum === "..." ? (
                            <span className="px-2 text-slate-400 font-medium">
                              ...
                            </span>
                          ) : (
                            <button
                              onClick={() => setCurrentPage(Number(pageNum))}
                              className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                                ${
                                  currentPage === pageNum
                                    ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                              {pageNum}
                            </button>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </div>

                  <button
                    disabled={
                      currentPage === Math.ceil(totalItems / itemsPerPage)
                    }
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
