// components/clients/ContactFormStep.tsx
import React from "react";
import { ClientFormData, EditingClient } from "../../types/client.types";

interface ContactFormStepProps {
  formData: ClientFormData | EditingClient;
  onChange: (field: keyof ClientFormData, value: string) => void;
}

export const ContactFormStep: React.FC<ContactFormStepProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Primary Contact Name{" "}
          <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
          value={formData.contact_officer_name}
          onChange={(e) => onChange("contact_officer_name", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
          value={formData.contact_officer_email}
          onChange={(e) => onChange("contact_officer_email", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
          value={formData.contact_officer_phone_no}
          onChange={(e) => onChange("contact_officer_phone_no", e.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Address <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
          value={formData.contact_officer_address}
          onChange={(e) => onChange("contact_officer_address", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          City <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
          value={formData.contact_officer_city}
          onChange={(e) => onChange("contact_officer_city", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          State <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
          value={formData.contact_officer_state}
          onChange={(e) => onChange("contact_officer_state", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          ZIP <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
          value={formData.contact_officer_zip}
          onChange={(e) => onChange("contact_officer_zip", e.target.value)}
        />
      </div>
    </div>
  );
};
