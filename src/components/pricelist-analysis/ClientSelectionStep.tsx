import {
  Building2,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDownIcon,
  Loader2,
} from "lucide-react";
import { Client } from "../../types/pricelist.types";
import { ClientDropdown } from "../../components/shared/ClientDropdown";

interface ClientSelectionStepProps {
  clients: Client[];
  selectedClient: number | null;
  onClientSelect: (clientId: number | null) => void;
  onContinue: () => void;
  error: React.ReactNode;
  errorVariant?: "error" | "warning" | "info";
  isLoading?: boolean;
}

export const ClientSelectionStep = ({
  clients,
  selectedClient,
  onClientSelect,
  onContinue,
  error,
  errorVariant = "error",
  isLoading = false,
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
        {isLoading ? (
          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <Loader2 className="w-5 h-5 animate-spin text-[#24578f]" />
            <span className="text-slate-500 text-sm font-medium">Fetching approved clients...</span>
          </div>
        ) : (
          <ClientDropdown
            clients={clients}
            selectedClient={selectedClient}
            onClientSelect={onClientSelect}
          />
        )}

        {error && (
          <div
            className={`p-4 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${errorVariant === "warning"
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : errorVariant === "info"
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
          >
            {errorVariant === "warning" ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : errorVariant === "info" ? (
              <Info className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
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
