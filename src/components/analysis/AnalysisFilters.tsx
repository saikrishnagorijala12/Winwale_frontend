import React from "react";
import { Search, Filter, CheckCircle2, ChevronDown } from "lucide-react";
import { StatusFilter } from "../../types/analysis.types";
import { Client } from "../../types/pricelist.types";
import { ClientDropdown } from "../shared/ClientDropdown";

interface AnalysisFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  clientFilter: string;
  setClientFilter: (value: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  dateFrom: Date | undefined;
  setDateFrom: (value: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (value: Date | undefined) => void;
  clients: Client[];
  onClearFilters: () => void;
}

export default function AnalysisFilters({
  searchQuery,
  setSearchQuery,
  clientFilter,
  setClientFilter,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  clients,
  onClearFilters,
}: AnalysisFiltersProps) {
  const selectedClientId =
    clientFilter === "All"
      ? 0
      : (clients.find((c) => c.company_name === clientFilter)?.client_id ?? 0);

  const handleClientSelect = (clientId: number) => {
    if (clientId === 0) {
      setClientFilter("All");
    } else {
      const client = clients.find((c) => c.client_id === clientId);
      setClientFilter(client?.company_name ?? "All");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#3399cc]" />
          <h2 className="text-sm font-bold text-slate-800">Filters</h2>
        </div>
        <button
          onClick={onClearFilters}
          className="text-sm font-semibold text-[#3399cc] hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Inputs */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 ">
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
                placeholder="Search by client, contract, or Analyst..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Client */}
          <div className="space-y-1 overflow-visible">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Client
            </label>
            <ClientDropdown
              clients={clients}
              selectedClient={selectedClientId}
              onClientSelect={handleClientSelect}
              allowAll
              allLabel="All Clients"
              placeholder="Filter by client..."
              compact
            />
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
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="w-full text-slate-500 appearance-none pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
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
                  className="w-full text-slate-500 px-4 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20  outline-none transition-all text-sm font-medium"
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
                  className="w-full text-slate-500 px-4 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20  outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
