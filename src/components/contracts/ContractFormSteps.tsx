import React, { useRef } from "react";
import {
  ClientContractCreate,
  ClientListRead,
  FormErrors,
} from "../../types/contract.types";
import { useClickOutside } from "../../hooks/useClickOutside";
import { AlertCircle, X } from "lucide-react";

interface Step1Props {
  contract: ClientContractCreate;
  onChange: (contract: ClientContractCreate) => void;
  onClearError?: (field: keyof FormErrors) => void;
  clients: ClientListRead[];
  clientSearch: string;
  setClientSearch: (search: string) => void;
  showClientDropdown: boolean;
  setShowClientDropdown: (show: boolean) => void;
  errors: FormErrors;
  hideClientField?: boolean;
}

export function Step1({
  contract,
  onChange,
  onClearError,
  clients,
  clientSearch,
  setClientSearch,
  showClientDropdown,
  setShowClientDropdown,
  errors,
  hideClientField = false,
}: Step1Props) {
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const isClientSelected = Boolean(contract.client_id);

  useClickOutside(
    clientDropdownRef,
    () => setShowClientDropdown(false),
    showClientDropdown,
  );

  const filteredClients = clients.filter(
    (c) =>
      c.client_id.toString().includes(clientSearch) ||
      c.company_name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Contract Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
            }`}
          value={contract.contract_number}
          onChange={(e) => {
            onChange({ ...contract, contract_number: e.target.value });
            onClearError?.("contract_number");
          }}
        />
        {errors.contract_number && (
          <div className="mt-1.5 text-xs text-red-600">
            <span>{errors.contract_number}</span>
          </div>
        )}
      </div>

      {!hideClientField && (
        <div className="md:col-span-2 relative" ref={clientDropdownRef}>
          <label className="text-sm font-bold text-slate-700">
            Client <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by Client ID or Company Name"
              className={`w-full mt-2 px-4 py-3 pr-10 rounded-xl border-2 transition-colors outline-none border-slate-200 "
                } ${isClientSelected ? "bg-slate-50 cursor-not-allowed" : ""}`}
              value={clientSearch}
              readOnly={isClientSelected}
              onFocus={() => {
                if (!isClientSelected) setShowClientDropdown(true);
              }}
              onChange={(e) => {
                if (isClientSelected) return;

                setClientSearch(e.target.value);
                setShowClientDropdown(true);

                onChange({ ...contract, client_id: undefined });
                onClearError?.("client_id");
              }}
            />

            {isClientSelected && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/3 text-slate-400 hover:text-red-500"
                onClick={() => {
                  onChange({ ...contract, client_id: undefined });
                  onClearError?.("client_id");
                  setClientSearch("");
                  setShowClientDropdown(false);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {errors.client_id && (
            <div className="mt-1 text-xs text-red-600">
              <span>{errors.client_id}</span>
            </div>
          )}

          {showClientDropdown && !isClientSelected && (
            <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
              {filteredClients.length === 0 ? (
                <div className="px-4 py-3 text-slate-500 text-sm">
                  No clients found
                </div>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.client_id}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 flex justify-between items-center"
                    onClick={() => {
                      onChange({ ...contract, client_id: client.client_id });
                      onClearError?.("client_id");
                      setClientSearch(`${client.company_name}`);
                      setShowClientDropdown(false);
                    }}
                  >
                    <span className="font-semibold text-slate-700">
                      {client.company_name}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-slate-700">
          Contract Officer Name
        </label>
        <input
          type="text"
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
            }`}
          value={contract.contract_officer_name || ""}
          onChange={(e) => {
            onChange({ ...contract, contract_officer_name: e.target.value });
            onClearError?.("contract_officer_name");
          }}
        />
        {errors.contract_officer_name && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.contract_officer_name}</span>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          GSA Office Address
        </label>
        <input
          type="text"
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
            }`}
          value={contract.contract_officer_address || ""}
          onChange={(e) => {
            onChange({ ...contract, contract_officer_address: e.target.value });
            onClearError?.("contract_officer_address");
          }}
        />
        {errors.contract_officer_address && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.contract_officer_address}</span>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          GSA Office City
        </label>
        <input
          type="text"
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
            }`}
          value={contract.contract_officer_city || ""}
          onChange={(e) => {
            onChange({ ...contract, contract_officer_city: e.target.value });
            onClearError?.("contract_officer_city");
          }}
        />
        {errors.contract_officer_city && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.contract_officer_city}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-bold text-slate-700">State</label>
          <input
            type="text"
            className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
              }`}
            value={contract.contract_officer_state || ""}
            onChange={(e) =>
              onChange({ ...contract, contract_officer_state: e.target.value })
            }
          />
          {errors.contract_officer_state && (
            <div className="mt-1 text-xs text-red-600">
              <span>{errors.contract_officer_state}</span>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">ZIP</label>
          <input
            type="text"
            className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
              }`}
            value={contract.contract_officer_zip || ""}
            onChange={(e) =>
              onChange({ ...contract, contract_officer_zip: e.target.value })
            }
          />
          {errors.contract_officer_zip && (
            <div className="mt-1 text-xs text-red-600">
              <span>{errors.contract_officer_zip}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Step2Props {
  contract: ClientContractCreate;
  onChange: (contract: ClientContractCreate) => void;
  onClearError?: (field: keyof FormErrors) => void;
  errors: FormErrors;
}

export function Step2({
  contract,
  onChange,
  onClearError,
  errors,
}: Step2Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-bold text-slate-700">FOB Term</label>
        <select
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none bg-white border-slate-200 "
            }`}
          value={contract.fob_term || "Origin"}
          onChange={(e) => onChange({ ...contract, fob_term: e.target.value })}
        >
          <option value="Origin">Origin</option>
          <option value="Destination">Destination</option>
          <option value="No Delivery">No Delivery</option>
        </select>
        {errors.fob_term && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.fob_term}</span>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Energy Star Compliance
        </label>
        <select
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none bg-white border-slate-200 "
            }`}
          value={contract.energy_star_compliance || "Yes"}
          onChange={(e) => {
            onChange({ ...contract, energy_star_compliance: e.target.value });
            onClearError?.("energy_star_compliance");
          }}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="N/A">N/A</option>
        </select>
        {errors.energy_star_compliance && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.energy_star_compliance}</span>
          </div>
        )}
      </div>
      <div>
        <label className="text-sm font-bold text-slate-700">
          Normal Delivery (Days)
        </label>
        <input
          type="number"
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
            }`}
          value={contract.normal_delivery_time || 30}
          onChange={(e) => {
            onChange({
              ...contract,
              normal_delivery_time: parseInt(e.target.value) || 0,
            });
            onClearError?.("normal_delivery_time");
          }}
        />
        {errors.normal_delivery_time && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.normal_delivery_time}</span>
          </div>
        )}
      </div>
      <div>
        <label className="text-sm font-bold text-slate-700">
          Expedited Delivery (Days)
        </label>
        <input
          type="number"
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none border-slate-200 "
            }`}
          value={contract.expedited_delivery_time || 10}
          onChange={(e) => {
            onChange({
              ...contract,
              expedited_delivery_time: parseInt(e.target.value) || 0,
            });
            onClearError?.("expedited_delivery_time");
          }}
        />
        {errors.expedited_delivery_time && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.expedited_delivery_time}</span>
          </div>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Quantity/Volume Discounts
        </label>
        <input
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none resize-none border-slate-200 "
            }`}
          value={contract.q_v_discount || ""}
          onChange={(e) => {
            onChange({ ...contract, q_v_discount: e.target.value });
            onClearError?.("q_v_discount");
          }}
        />
        {errors.q_v_discount && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.q_v_discount}</span>
          </div>
        )}
      </div>
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Additional Concessions
        </label>
        <textarea
          rows={2}
          className={`w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors outline-none resize-none border-slate-200 "
            }`}
          value={contract.additional_concessions || ""}
          onChange={(e) => {
            onChange({ ...contract, additional_concessions: e.target.value });
            onClearError?.("additional_concessions");
          }}
        />
        {errors.additional_concessions && (
          <div className="mt-1 text-xs text-red-600">
            <span>{errors.additional_concessions}</span>
          </div>
        )}
      </div>
    </div>
  );
}
