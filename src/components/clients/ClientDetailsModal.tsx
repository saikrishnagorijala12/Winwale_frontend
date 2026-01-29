import React from 'react';
import { X, Building2, User, Mail, Phone, MapPin, Globe, Edit } from 'lucide-react';
import { Client } from '../../types/client.types';
import { ContactRow } from './ContactRow';

interface ClientDetailsModalProps {
  client: Client | null;
  onClose: () => void;
  onEdit: (client: Client) => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, onClose ,onEdit}) => {
  if (!client) return null;

  const handleEdit = () => {
    onEdit(client);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60  z-50 flex items-center justify-center p-4">
      {/* Click-away backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="relative bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#38A1DB] font-black text-2xl border-4 border-white/20">
              {client.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1">Client Profile</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {client.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left Column: Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-5 h-5 text-[#38A1DB]" />
                <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Company Details</h3>
              </div>
              
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 space-y-4">
                <ContactRow icon={Mail} value={client.email} />
                <ContactRow icon={Phone} value={client.phone} />
                <ContactRow icon={MapPin} value={client.address} />
              </div>
            </div>

            {/* Right Column: Primary Contact */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-5 h-5 text-[#38A1DB]" />
                <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Primary Contact</h3>
              </div>

              <div className="bg-blue-50/30 rounded-xl p-5 border border-blue-100/50">
                {!client.contact ? (
                  <div className="text-center py-6">
                    <p className="text-slate-400 italic text-sm">No primary contact assigned</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#38A1DB] uppercase tracking-tighter">Full Name</span>
                      <p className="text-slate-900 font-bold text-lg leading-none mt-1">
                        {client.contact.name || "—"}
                      </p>
                    </div>
                    <div className="pt-2 space-y-3 border-t border-blue-100/50">
                      <ContactRow icon={Mail} value={client.contact.email} />
                      <ContactRow icon={Phone} value={client.contact.phone} />
                    </div>
                  </div>
                )}
              </div>
            </div>

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
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-br from-[#38A1DB] to-[#2D8BBF] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <Edit className="w-4 h-4" />
            Edit Client
          </button>
        </div>
      </div>
    </div>
  );
};