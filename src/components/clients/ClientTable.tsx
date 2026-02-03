import React from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  MoreVertical,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Calendar,
} from "lucide-react";
import { Client } from "../../types/client.types";
import { ClientActionsMenu } from "./ClientActionsMenu";
import {
  normalizeStatus,
  STATUS_BADGE_BASE,
  STATUS_MAP,
} from "@/src/utils/statusUtils";

interface ClientTableProps {
  clients: Client[];
  loading: boolean;
  openClientId: number | null;
  onClientClick: (client: Client) => void;
  onMenuToggle: (clientId: number) => void;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  // Pagination Props
  currentPage: number;
  totalClients: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
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
  const slug = normalizeStatus(status);

  if (slug === "unknown") {
    return (
      <span
        className={`${STATUS_BADGE_BASE} bg-slate-100 text-slate-700 border-slate-200`}
      >
        Unknown
      </span>
    );
  }

  const { label, styles, icon: Icon } = STATUS_MAP[slug];

  return (
    <span className={`${STATUS_BADGE_BASE} ${styles}`}>
      <Icon className="w-3 h-3 stroke-[2.5px]" />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
};

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  loading,
  openClientId,
  onClientClick,
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

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const EmptyState = () => (
    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
        <Inbox className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-base font-bold text-slate-500">No clients found</h3>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 ">
      {/* DESKTOP/TABLET TABLE */}
      <div className="hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="hidden lg:table-cell px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Company Email
              </th>
              <th className="hidden xl:table-cell px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                    <Loader2 className="w-8 h-8 animate-spin text-[#24578f]" />
                    <p className="text-sm text-slate-500 font-medium">
                      Loading clients...
                    </p>
                  </div>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState />
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
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-br from-[#3399cc] to-[#2980b9] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#38A1DB] transition-colors  max-w-50">
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(client.status)}</td>
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
                        <span className="hidden lg:block text-xs text-slate-500 truncate">
                          {client.contact.email}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 text-sm font-medium text-slate-600 truncate max-w-45">
                    {client.email}
                  </td>
                  <td className="hidden xl:table-cell px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(client.lastModification)}
                    </div>
                  </td>
                  <td className="p-5 relative text-right">
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

      {/* MOBILE CARDS (Below md) */}
      <div className="md:hidden divide-y divide-slate-100">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#24578f]" />
          </div>
        ) : clients.length === 0 ? (
          <EmptyState />
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

      {/*PAGINATION*/}
      {!loading && totalClients > itemsPerPage && (
        <div className="px-6 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 font-medium">
            Showing{" "}
            <span className="text-slate-900 font-semibold">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="text-slate-900 font-semibold">
              {Math.min(startIndex + itemsPerPage, totalClients)}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 font-semibold">{totalClients}</span>{" "}
            clients
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all mr-2"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, idx) => (
                <React.Fragment key={idx}>
                  {pageNum === "..." ? (
                    <span className="px-2 text-slate-400 font-medium">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(Number(pageNum))}
                      className={`min-w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                        ${
                          currentPage === pageNum
                            ? "bg-[#3399cc] text-white shadow-md shadow-[#3399cc]/30"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all ml-2"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
