import React from "react";
import { Loader2, MoreVertical, Inbox, Calendar, FileText } from "lucide-react";
import { ClientActionsMenu } from "./ActionsMenu";
import StatusBadge from "../shared/StatusBadge";
import Pagination from "../shared/Pagination";
import { Client } from "../../types/client.types";
import { ClientContractRead } from "../../types/contract.types";

interface ClientContractTableProps {
  clients: Client[];
  contracts: ClientContractRead[];
  loading: boolean;
  openClientId: number | null;
  onRowClick: (client: Client) => void;
  onMenuToggle: (clientId: number) => void;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  currentPage: number;
  totalClients: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const EmptyState = () => (
  <div className="py-20 flex flex-col items-center justify-center text-center px-4">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
      <Inbox className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-base font-bold text-slate-500">No records found</h3>
  </div>
);

export const ClientContractTable: React.FC<ClientContractTableProps> = ({
  clients,
  contracts,
  loading,
  openClientId,
  onRowClick,
  onMenuToggle,
  onView,
  onEdit,
  currentPage,
  totalClients,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalClients / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const getContract = (clientId: number) =>
    contracts.find((c) => c.client_id === clientId) ?? null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-225">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Contract #
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Contact
              </th>

              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Contracting Officer
              </th>
              <th className="hidden xl:table-cell px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="w-16 p-5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                    <p className="text-sm text-slate-500 font-medium">
                      Loading client profiles...
                    </p>
                  </div>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              clients.map((client) => {
                const contract = getContract(client.id);
                return (
                  <tr
                    key={client.id}
                    onClick={() => onRowClick(client)}
                    className="group hover:bg-blue-50/30 cursor-pointer transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`shrink-0 w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden ${
                            client.logoUrl
                              ? "bg-white"
                              : "bg-linear-to-br from-[#3399cc] to-[#2980b9]"
                          }`}
                        >
                          {client.logoUrl ? (
                            <img
                              src={client.logoUrl}
                              alt={client.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            client.name.substring(0, 2).toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 group-hover:text-[#38A1DB] transition-colors truncate max-w-40">
                            {client.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-40">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {contract ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-sm font-semibold text-slate-800 truncate max-w-30">
                            {contract.contract_number}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] italic font-medium text-gray-400 uppercase">
                          No Contract
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={client.status} />
                    </td>

                    <td className="px-6 py-4">
                      {!client.contact ? (
                        <span className="text-[10px] italic font-medium text-gray-400 uppercase">
                          Not Assigned
                        </span>
                      ) : (
                        <div className="flex flex-col max-w-37.5">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {client.contact.name}
                          </span>
                          <span className="text-xs text-slate-500 truncate">
                            {client.contact.email}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {contract ? (
                        <span className="text-sm font-medium text-slate-700">
                          {contract.contract_officer_name || "—"}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="hidden xl:table-cell px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(client.lastModification)}
                      </div>
                    </td>

                    <td className="p-5 text-right">
                      <div className="flex justify-end">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMenuToggle(client.id);
                            }}
                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-slate-500" />
                          </button>
                          {openClientId === client.id && (
                            <ClientActionsMenu
                              client={client}
                              onView={() => onView(client)}
                              onEdit={() => onEdit(client)}
                              onClose={() => onMenuToggle(client.id)}
                              openUpwards={
                                clients.indexOf(client) >= clients.length - 2
                              }
                            />
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-slate-100">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#24578f]" />
          </div>
        ) : clients.length === 0 ? (
          <EmptyState />
        ) : (
          clients.map((client) => {
            const contract = getContract(client.id);
            return (
              <div
                key={client.id}
                onClick={() => onRowClick(client)}
                className="p-5 hover:bg-blue-50/50 transition active:bg-blue-100 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-linear-to-br flex items-center justify-center text-white font-bold text-lg shadow-blue-100 shadow-lg overflow-hidden${
                        client.logoUrl
                          ? "bg-white"
                          : "bg-linear-to-br from-[#3399cc] to-[#2980b9]"
                      }`}
                    >
                      {client.logoUrl ? (
                        <img
                          src={client.logoUrl}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        client.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {client.name}
                      </h3>
                      <div className="mt-1">
                        <StatusBadge status={client.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMenuToggle(client.id);
                        }}
                        className="p-2 rounded-xl bg-white"
                      >
                        <MoreVertical className="w-5 h-5 text-slate-500" />
                      </button>
                      {openClientId === client.id && (
                        <ClientActionsMenu
                          client={client}
                          onView={() => onView(client)}
                          onEdit={() => onEdit(client)}
                          onClose={() => onMenuToggle(client.id)}
                          openUpwards={
                            clients.indexOf(client) >= clients.length - 2
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Contact
                    </p>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {client.contact?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Contract #
                    </p>
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {contract?.contract_number || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      FOB Term
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {contract?.fob_term || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Contracting Officer
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {contract?.contract_officer_name || "—"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalClients}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        label="client profiles"
      />
    </div>
  );
};
