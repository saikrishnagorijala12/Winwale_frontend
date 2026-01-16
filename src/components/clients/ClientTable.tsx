// components/clients/ClientTable.tsx
import React from "react";
import { Loader2, MoreVertical } from "lucide-react";
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
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
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
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100">
      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="border-b-2 border-slate-200">
            <tr>
              <th className="text-left p-5 font-bold text-slate-700">Client</th>
              <th className="text-left p-5 font-bold text-slate-700">
                Contract
              </th>
              <th className="text-left p-5 font-bold text-slate-700">
                Contact
              </th>
              <th className="text-left p-5 font-bold text-slate-700">
                Company Email
              </th>
              <th className="text-left p-5 font-bold text-slate-700">
                Last Modified
              </th>
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#38A1DB]" />
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => onClientClick(client)}
                  className="border-b border-slate-100 hover:bg-blue-50/50 cursor-pointer transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] flex items-center justify-center text-white font-bold">
                        {client.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {client.name}
                      </span>
                    </div>
                  </td>

                  <td className="p-5 text-slate-600">{client.contract}</td>

                  <td className="p-5">
                    {!client.contact ? (
                      <span className="text-slate-400 text-sm italic">
                        No contact
                      </span>
                    ) : (
                      <div className="text-sm">
                        <div className="font-medium text-slate-800">
                          {client.contact.name}
                        </div>
                        {client.contact.email && (
                          <div className="text-slate-500 text-xs">
                            {client.contact.email}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="p-5 text-slate-600">{client.email}</td>

                  <td className="p-5 text-slate-600">
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
          <div className="py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#38A1DB]" />
          </div>
        ) : clients.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No clients found
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              onClick={() => onClientClick(client)}
              className="p-4 hover:bg-blue-50/50 transition cursor-pointer"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] flex items-center justify-center text-white font-bold">
                    {client.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {client.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {client.contract}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMenuToggle(client.id);
                  }}
                  className="p-2 hover:bg-slate-200 rounded-lg"
                >
                  <MoreVertical className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <div>
                  <span className="font-medium text-slate-700">Contact:</span>{" "}
                  {client.contact?.name || "—"}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Email:</span>{" "}
                  {client.email}
                </div>
                <div>
                  <span className="font-medium text-slate-700">
                    Last Modified:
                  </span>{" "}
                  {formatDate(client.lastModification)}
                </div>
              </div>

              {openClientId === client.id && (
                <div className="relative">
                  <ClientActionsMenu
                    client={client}
                    onView={() => onView(client)}
                    onEdit={() => onEdit(client)}
                    onClose={() => onMenuToggle(client.id)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
