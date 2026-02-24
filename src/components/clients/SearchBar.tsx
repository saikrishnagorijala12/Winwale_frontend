import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange
}) => {
  const statuses = ["all", "approved", "pending", "rejected"];

  return (
    <div className="mx-auto bg-white p-4 rounded-4xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row gap-4 items-center">
      {/* Search Input Container */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, contact, or contract number..."
          className="w-full pl-14 pr-6 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20  bg-slate-50/50 text-slate-700 placeholder:text-slate-400 transition-all font-medium"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Buttons Container */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
        {statuses.map((status) => {
          const isActive = filterStatus === status;
          return (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`
                flex-1 lg:flex-none px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? "bg-white text-[#24548f] shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }
              `}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
};