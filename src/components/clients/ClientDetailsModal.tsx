// components/clients/ClientDetailsModal.tsx
import React from 'react';
import { X, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import { Client } from '../../types/client.types';
import { ContactRow } from './ContactRow';

interface ClientDetailsModalProps {
  client: Client | null;
  onClose: () => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, onClose }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-none z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Section */}
        <div className="sticky top-0 bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
                  <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#E0F2FE] to-[#BAE6FD] flex items-center justify-center text-[#0369A1] font-extrabold text-lg">
                    {client.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  {client.name}
                </h2>
                <p className="text-sm md:text-base text-blue-100 font-medium mt-1">
                  Contract&nbsp;
                  <span className="font-semibold text-white/90">
                    {client.contract || "—"}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-white/20"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          {/* Left Card: Company Details */}
          <div className="bg-linear-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-9">
              <Building2 className="w-6 h-6 text-[#38A1DB]" />
              <h3 className="text-xl font-bold text-slate-800">Company Details</h3>
            </div>
            <div className="space-y-5">
              <ContactRow icon={Mail} value={client.email} />
              <ContactRow icon={Phone} value={client.phone} />
              <ContactRow icon={MapPin} value={client.address} />
            </div>
          </div>

          {/* Right Card: Primary Contact */}
          <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#38A1DB]" />
              <h3 className="text-xl font-bold text-slate-800">Primary Contact</h3>
            </div>

            {!client.contact ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No primary contact added</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Contact Name
                  </label>
                  <p className="text-slate-800 font-semibold mt-1">
                    {client.contact.name || "—"}
                  </p>
                </div>
                <ContactRow icon={Mail} value={client.contact.email} />
                <ContactRow icon={Phone} value={client.contact.phone} />
                <ContactRow icon={MapPin} value={client.contact.address} />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-3xl flex justify-between border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};