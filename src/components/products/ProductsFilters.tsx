import React from "react";
import { Search } from "lucide-react";
import { Client as ProductClient } from "../../types/product.types";
import { ClientDropdown } from "../shared/ClientDropdown";

interface ProductsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  clients: ProductClient[];
  selectedClient: ProductClient | null;
  onClientSelect: (client: ProductClient | null) => void;
}

export default function ProductsFilters({
  searchTerm,
  onSearchChange,
  clients,
  selectedClient,
  onClientSelect,
}: ProductsFiltersProps) {
  const handleClientSelect = (clientId: number) => {
    if (clientId === 0) {
      onClientSelect(null);
    } else {
      const match = clients.find((c) => c.client_id === clientId);
      onClientSelect(match ?? null);
    }
  };

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

      <div className="w-full lg:w-80">
        <ClientDropdown
          clients={clients}
          selectedClient={selectedClient?.client_id ?? 0}
          onClientSelect={handleClientSelect}
          allowAll
          allLabel="All Clients"
          placeholder="Filter by client..."
        />
      </div>
    </div>
  );
}