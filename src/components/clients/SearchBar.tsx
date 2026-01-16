// components/clients/SearchBar.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="mx-auto bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-6 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search clients by name or contract..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none bg-white text-slate-700 placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};