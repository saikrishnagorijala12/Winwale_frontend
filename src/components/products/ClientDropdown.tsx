import React, { useState, useRef, useEffect } from "react";
import { Building2, ChevronDown, Search, Check } from "lucide-react";
import { Client } from "../../types/product.types";

interface ClientDropdownProps {
  clients: Client[];
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
}

export default function ClientDropdown({
  clients,
  selectedClient,
  onClientSelect,
}: ClientDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClientSelect = (client: Client | null) => {
    onClientSelect(client);
    setIsDropdownOpen(false);
    setClientSearch("");
  };

  const filteredClients = clients.filter((c) =>
    c.company_name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  return (
    <div className="relative w-full md:w-80" ref={dropdownRef}>
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/50 border rounded-2xl cursor-pointer transition-all hover:border-slate-300 ${isDropdownOpen ? "border-[#3399cc] ring-4 ring-[#3399cc]/10" : "border-slate-200"}`}
      >
        <div className="flex items-center gap-3 overflow-hidden text-slate-700">
          <Building2 size={18} className="text-slate-400 shrink-0" />
          <span
            className={`truncate font-medium ${!selectedClient ? "text-slate-400" : "text-slate-900"}`}
          >
            {selectedClient ? selectedClient.company_name : "All Clients"}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                autoFocus
                type="text"
                placeholder="Search by company name..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-[#3399cc] bg-white transition-colors"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            <div
              onClick={() => handleClientSelect(null)}
              className="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
            >
              <span className="font-medium text-slate-600">Show All</span>
              {!selectedClient && (
                <Check size={16} className="text-[#3399cc]" />
              )}
            </div>
            {filteredClients.map((client) => (
              <div
                key={client.client_id}
                onClick={() => handleClientSelect(client)}
                className="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors border-t border-slate-50"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-800">
                    {client.company_name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tight">
                    {client.status}
                  </span>
                </div>
                {selectedClient?.client_id === client.client_id && (
                  <Check size={16} className="text-[#3399cc]" />
                )}
              </div>
            ))}
            {filteredClients.length === 0 && (
              <div className="px-4 py-10 text-center text-slate-400 text-sm italic">
                No companies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}