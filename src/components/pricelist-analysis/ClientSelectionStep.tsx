import React from "react";
import {
  Building2,
  ChevronRight,
  AlertCircle,
  ChevronDownIcon,
} from "lucide-react";
import { Client } from "../../types/pricelist.types";
import { ClientDropdown } from "../../components/shared/ClientDropdown";

interface ClientSelectionStepProps {
  clients: Client[];
  selectedClient: string;
  onClientSelect: (clientId: string) => void;
  onContinue: () => void;
  error: string | null;
}

export const ClientSelectionStep = ({
  clients,
  selectedClient,
  onClientSelect,
  onContinue,
  error,
}: ClientSelectionStepProps) => {
  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-visible z-10 relative">
      <div className="p-8 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-2.5 bg-cyan-50 rounded-xl shadow-sm ring-1 ring-cyan-100">
            <Building2 className="w-5 h-5 text-[#3399cc]" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
            Select Client
          </h3>
        </div>
        <p className="text-sm text-slate-500">Choose the client for analysis</p>
      </div>

      <div className="p-8 space-y-8 relative">
        <ClientDropdown
          clients={clients}
          selectedClient={selectedClient}
          onClientSelect={onClientSelect}
        />

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onContinue}
            disabled={!selectedClient}
            className="btn-primary"
          >
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
