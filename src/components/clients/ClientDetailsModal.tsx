import React from "react";
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { Client } from "../../types/client.types";
import { ContactRow } from "./ContactRow";
import { formatPhoneNumber } from "../../utils/phoneUtils";

interface ClientDetailsModalProps {
  client: Client | null;
  onClose: () => void;
  onEdit: (client: Client) => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  client,
  onClose,
  onEdit,
}) => {
  const [currentNegIndex, setCurrentNegIndex] = React.useState(0);
  if (!client) return null;

  const handleEdit = () => {
    onEdit(client);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 m-auto z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="relative px-10 py-8 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#38A1DB] flex items-center justify-center text-white font-black text-2xl shadow-md overflow-hidden">
              {client.logoUrl ? (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="w-full h-full object-contain bg-white p-1"
                />
              ) : (
                client.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              )}
            </div>

            <div>
              <p className="text-[11px] tracking-widest uppercase text-[#38A1DB] font-semibold mb-1">
                Client Profile
              </p>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {client.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10">
          {/* Top Section */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Company */}
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#38A1DB]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">
                  Company Details
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                <ContactRow icon={Mail} value={client.email} />
                <ContactRow
                  icon={Phone}
                  value={formatPhoneNumber(client.phone)}
                />
                <ContactRow icon={MapPin} value={client.address} />
              </div>
            </div>

            {/* Negotiators */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#38A1DB]" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">
                    Negotiators
                  </h3>
                </div>

                {client.negotiators?.length > 1 && (
                  <span className="text-[11px] font-bold bg-slate-100 text-[#38A1DB] px-3 py-1 rounded-full">
                    {currentNegIndex + 1} / {client.negotiators.length}
                  </span>
                )}
              </div>

              {!client.negotiators || client.negotiators.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 min-h-45">
                  <User className="w-6 h-6 text-slate-300" />
                  <p className="text-slate-400 italic text-sm">
                    No negotiators assigned
                  </p>
                </div>
              ) : (
                <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm">
                  {/* Switch Buttons */}
                  {client.negotiators.length > 1 && (
                    <div className="absolute top-5 right-5 flex gap-2">
                      <button
                        onClick={() =>
                          setCurrentNegIndex((prev) =>
                            prev > 0 ? prev - 1 : client.negotiators.length - 1,
                          )
                        }
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-[#38A1DB] hover:bg-white transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setCurrentNegIndex((prev) =>
                            prev < client.negotiators.length - 1 ? prev + 1 : 0,
                          )
                        }
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-[#38A1DB] hover:bg-white transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] uppercase font-bold text-[#38A1DB] tracking-wider">
                        {client.negotiators[currentNegIndex].title ||
                          "Negotiator"}
                      </p>

                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {client.negotiators[currentNegIndex].name || "—"}
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-4 space-y-3">
                      {client.negotiators[currentNegIndex].email && (
                        <ContactRow
                          icon={Mail}
                          value={client.negotiators[currentNegIndex].email}
                        />
                      )}

                      {client.negotiators[currentNegIndex].phone_no && (
                        <ContactRow
                          icon={Phone}
                          value={formatPhoneNumber(
                            client.negotiators[currentNegIndex].phone_no,
                          )}
                        />
                      )}

                      <ContactRow
                        icon={MapPin}
                        value={[
                          client.negotiators[currentNegIndex].address,
                          client.negotiators[currentNegIndex].city,
                          client.negotiators[currentNegIndex].state,
                          client.negotiators[currentNegIndex].zip,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contract Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#38A1DB]" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">
                Contract Information
              </h3>
            </div>

            {!client.contractDetails ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center">
                <p className="text-slate-400 italic text-sm">
                  No active contract found for this client
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-[#38A1DB] tracking-wider">
                      Contract Number
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {client.contractDetails.contract_number || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase font-bold text-[#38A1DB] tracking-wider">
                      Origin Country
                    </p>
                    <p className="text-slate-700 mt-1">
                      {client.contractDetails.origin_country || "—"}
                    </p>
                  </div>
                </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div>
                      <p className="text-[11px] uppercase font-bold text-[#38A1DB] tracking-wider">
                        EPA Method
                      </p>
                      <p className="text-slate-700 mt-1">
                        {client.contractDetails.epa_method_mechanism || "—"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        {client.contractDetails.is_hazardous ? (
                          <>
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 font-semibold text-sm">
                              Hazardous
                            </span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-semibold text-sm">
                              Non-Hazardous
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {client.contractDetails.is_tdr ? (
                          <>
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-600 font-semibold text-sm">
                              TDR Contract
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400 font-semibold text-sm">
                              Non-TDR
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-[#38A1DB] tracking-wider">
                      Delivery Time
                    </p>
                    <p className="text-slate-700 mt-1">
                      {client.contractDetails.normal_delivery_time || 0} /{" "}
                      {client.contractDetails.expedited_delivery_time || 0} Days
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase font-bold text-[#38A1DB] tracking-wider">
                      GSA Discount
                    </p>
                    <p className="text-slate-700 mt-1">
                      {client.contractDetails.gsa_proposed_discount || 0}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-5 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>

          <button onClick={handleEdit} className="btn-primary">
            <Edit className="w-4 h-4" />
            Edit Client
          </button>
        </div>
      </div>
    </div>
  );
};
