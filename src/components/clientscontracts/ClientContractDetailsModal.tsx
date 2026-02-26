import React from "react";
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Edit2,
  Truck,
  Zap,
  Globe,
  Calendar,
  Percent,
  Map,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/axios";
import { Client } from "../../types/client.types";
import { ClientContractRead } from "../../types/contract.types";
import StatusBadge from "../shared/StatusBadge";

interface ClientContractDetailsModalProps {
  client: Client | null;
  contract: ClientContractRead | null;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onSuccess?: () => void;
}

const DetailItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: any;
  label: string;
  value: string | number | null | undefined;
  className?: string;
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="text-sm font-medium text-slate-700 truncate">
        {value || "—"}
      </span>
    </div>
  </div>
);

const Section = ({
  icon: Icon,
  title,
  children,
  badge,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  badge?: string;
}) => (
  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#38A1DB]" />
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </h3>
      </div>
      {badge && (
        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500 uppercase">
          {badge}
        </span>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
      {children}
    </div>
  </div>
);

export const ClientContractDetailsModal: React.FC<
  ClientContractDetailsModalProps
> = ({ client, contract, onClose, onEdit, onSuccess }) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!client) return null;

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      await api.post(`/clients/${client.id}/logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Logo uploaded successfully");
      onSuccess?.();
    } catch (error: any) {
      console.error("Logo upload failed:", error);
      toast.error(error.response?.data?.detail || "Failed to upload logo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatAddress = (c: any) => {
    const parts = [
      c.contract_officer_address,
      [c.contract_officer_city, c.contract_officer_state]
        .filter(Boolean)
        .join(", "),
      c.contract_officer_zip,
    ];
    return parts.filter(Boolean).join(", ");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div
                className={`w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-100 overflow-hidden ${
                  client.logoUrl
                    ? "bg-slate-50/50"
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
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-lg shadow-md border border-slate-100 text-slate-600 hover:text-[#38A1DB] transition-all active:scale-95 disabled:opacity-50"
                title="Upload Logo"
              >
                {isUploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {client.name}
                </h2>
                <StatusBadge status={client.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
                {contract && (
                  <div className="h-4 w-px bg-slate-200 hidden md:block" />
                )}
                {contract && (
                  <div className="flex items-center gap-1.5 text-blue-600 font-semibold uppercase text-xs tracking-wider">
                    <FileText className="w-4 h-4" />
                    {contract.contract_number}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <Section icon={Building2} title="Company Details">
                <DetailItem icon={Phone} label="Phone" value={client.phone} />
                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={client.email || "N/A"}
                />
                <DetailItem
                  icon={MapPin}
                  label="Office Address"
                  value={client.address}
                  className="sm:col-span-2"
                />
              </Section>

              <Section icon={User} title="Primary Contact" badge="Negotiator">
                <DetailItem
                  icon={User}
                  label="Full Name"
                  value={client.contact?.name}
                />
                <DetailItem
                  icon={Phone}
                  label="Direct Phone"
                  value={client.contact?.phone}
                />
                <DetailItem
                  icon={Mail}
                  label="Direct Email"
                  value={client.contact?.email}
                  className="sm:col-span-2"
                />
                <DetailItem
                  icon={MapPin}
                  label="Direct Address"
                  value={client.contact?.address}
                  className="sm:col-span-2"
                />
              </Section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {contract ? (
                <>
                  <Section icon={FileText} title="Contract Overview">
                    <DetailItem
                      icon={User}
                      label="Contract Officer"
                      value={contract.contract_officer_name}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Contract Number"
                      value={contract.contract_number}
                    />
                    <DetailItem
                      icon={MapPin}
                      label="GSA Billing Address"
                      value={formatAddress(contract)}
                      className="sm:col-span-2"
                    />
                  </Section>

                  <Section icon={Zap} title="Logistics & Terms">
                    <DetailItem
                      icon={Percent}
                      label="Q/V Discount"
                      value={contract.q_v_discount}
                    />
                    <DetailItem
                      icon={Truck}
                      label="FOB Term"
                      value={contract.fob_term}
                    />
                    <DetailItem
                      icon={Calendar}
                      label="Normal Delivery"
                      value={`${contract.normal_delivery_time} Days`}
                    />
                    <DetailItem
                      icon={Zap}
                      label="Expedited"
                      value={`${contract.expedited_delivery_time} Days`}
                    />
                    <DetailItem
                      icon={FileText}
                      label="Concessions"
                      value={contract.additional_concessions}
                      className="sm:col-span-2"
                    />
                  </Section>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-100 rounded-4xl text-center bg-slate-50/30">
                  <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                    <FileText className="w-6 h-6 text-slate-300" />
                  </div>
                  <h4 className="text-base font-bold text-slate-700">
                    No Contract Linked
                  </h4>
                  <p className="text-sm text-slate-400 mt-1 max-w-60">
                    This client profile does not have an active GSA contract
                    associated.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            Last modified: {client.lastModification || "Never"}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(client);
                onClose();
              }}
              className="btn-primary"
            >
              <Edit2 className="w-4 h-4" />
              Edit details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
