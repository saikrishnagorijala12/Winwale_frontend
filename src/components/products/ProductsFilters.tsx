import React from "react";
import { Search } from "lucide-react";
import { Client } from "../../types/product.types";
import ClientDropdown from "./ClientDropdown";

interface ProductsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  clients: Client[];
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
}

export default function ProductsFilters({
  searchTerm,
  onSearchChange,
  clients,
  selectedClient,
  onClientSelect,
}: ProductsFiltersProps) {
  return (
    <div className="mx-auto bg-white p-4 rounded-4xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name, manufacturer, or part number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-14 pr-6 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20  bg-slate-50/50 text-slate-700 placeholder:text-slate-400 transition-all font-medium"
        />
      </div>

      <ClientDropdown
        clients={clients}
        selectedClient={selectedClient}
        onClientSelect={onClientSelect}
      />
    </div>
  );
}