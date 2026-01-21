import React from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  MoreVertical,
  XCircle,
  User,
} from "lucide-react";
import { Client } from "../../types/client.types";
import { ClientActionsMenu } from "./ClientActionsMenu";

interface ClientTableProps {
  clients: Client[];
  loading: boolean;
  openClientId: number | null;
  onClientClick: (client: Client) => void;
  onMenuToggle: (clientId: number) => void;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  const baseClasses =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border";

  if (status === "rejected") {
    return (
      <span
        className={`${baseClasses} bg-rose-50 text-rose-700 border-rose-100`}
      >
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  } else if (status === "approved") {
    return (
      <span
        className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-100`}
      >
        <CheckCircle2 className="w-3 h-3" /> Approved
      </span>
    );
  } else {
    return (
      <span
        className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-100`}
      >
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  }
};

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  loading,
  openClientId,
  onClientClick,
  onMenuToggle,
  onView,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 ">
      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Company Email
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="w-16 p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm text-slate-500 font-medium">
                      Loading clients...
                    </p>
                  </div>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center text-slate-500">
                  No clients found matching your criteria.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => onClientClick(client)}
                  className="group hover:bg-blue-50/30 cursor-pointer transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3399cc] to-[#2980b9] flex items-center justify-center text-white font-bold shadow-sm shadow-blue-200">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#38A1DB] transition-colors">
                        {client.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">{getStatusBadge(client.status)}</td>

                  <td className="px-6 py-4">
                    {!client.contact ? (
                      <span className=" text-xs italic font-medium tracking-wide text-gray-400 uppercase">
                        Not Assigned
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">
                          {client.contact.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {client.contact.email}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {client.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(client.lastModification)}
                  </td>

                  <td className="p-5 relative">
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
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===================== MOBILE CARDS ===================== */}
      <div className="md:hidden divide-y divide-slate-100">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#3399cc]" />
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              onClick={() => onClientClick(client)}
              className="p-5 hover:bg-blue-50/50 transition active:bg-blue-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#3399cc] to-[#2980b9] flex items-center justify-center text-white font-bold text-lg shadow-blue-100 shadow-lg">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {client.name}
                    </h3>
                    <div className="mt-1">{getStatusBadge(client.status)}</div>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMenuToggle(client.id);
                    }}
                    className="p-2 border border-slate-200 rounded-xl bg-white shadow-sm"
                  >
                    <MoreVertical className="w-5 h-5 text-slate-500" />
                  </button>

                  {openClientId === client.id && (
                    <ClientActionsMenu
                      client={client}
                      onView={() => onView(client)}
                      onEdit={() => onEdit(client)}
                      onClose={() => onMenuToggle(client.id)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
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
                    Modified
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(client.lastModification)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Company Email
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {client.email}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
