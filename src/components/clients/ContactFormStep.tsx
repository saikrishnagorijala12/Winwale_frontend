import React from "react";
import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../../types/client.types";

interface ContactFormStepProps {
  formData: ClientFormData | EditingClient;
  onChange: (field: keyof ClientFormData, value: string) => void;
  errors: ClientFormErrors;
  onClearError: (field: keyof ClientFormErrors) => void;
}

export const ContactFormStep: React.FC<ContactFormStepProps> = ({
  formData,
  onChange,
  errors,
  onClearError,
}) => {
  const inputClass = (field: keyof ClientFormErrors) =>
    `w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none border-slate-200 focus:border-[#38A1DB]"
    }`;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Primary Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={inputClass("contact_officer_name")}
          value={formData.contact_officer_name}
          onChange={(e) => {
            onChange("contact_officer_name", e.target.value);
            onClearError("contact_officer_name");
          }}
          aria-invalid={!!errors.contact_officer_name}
        />
        {errors.contact_officer_name && (
          <p className="mt-1 text-xs text-red-600">
            {errors.contact_officer_name}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className={inputClass("contact_officer_email")}
          value={formData.contact_officer_email}
          onChange={(e) => {
            onChange("contact_officer_email", e.target.value);
            onClearError("contact_officer_email");
          }}
          aria-invalid={!!errors.contact_officer_email}
        />
        {errors.contact_officer_email && (
          <p className="mt-1 text-xs text-red-600">
            {errors.contact_officer_email}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          className={inputClass("contact_officer_phone_no")}
          value={formData.contact_officer_phone_no}
          onChange={(e) => {
            onChange("contact_officer_phone_no", e.target.value);
            onClearError("contact_officer_phone_no");
          }}
          aria-invalid={!!errors.contact_officer_phone_no}
        />
        {errors.contact_officer_phone_no && (
          <p className="mt-1 text-xs text-red-600">
            {errors.contact_officer_phone_no}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Address
        </label>
        <input
          type="text"
          className={inputClass("contact_officer_address")}
          value={formData.contact_officer_address || ""}
          onChange={(e) => {
            onChange("contact_officer_address", e.target.value);
            onClearError("contact_officer_address");
          }}
        />
        {errors.contact_officer_address && (
          <p className="mt-1 text-xs text-red-600">
            {errors.contact_officer_address}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          City
        </label>
        <input
          type="text"
          className={inputClass("contact_officer_city")}
          value={formData.contact_officer_city || ""}
          onChange={(e) => {
            onChange("contact_officer_city", e.target.value);
            onClearError("contact_officer_city");
          }}
        />
        {errors.contact_officer_city && (
          <p className="mt-1 text-xs text-red-600">
            {errors.contact_officer_city}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          State
        </label>
        <input
          type="text"
          className={inputClass("contact_officer_state")}
          value={formData.contact_officer_state || ""}
          onChange={(e) => {
            onChange("contact_officer_state", e.target.value);
            onClearError("contact_officer_state");
          }}
        />
        {errors.contact_officer_state && (
          <p className="mt-1 text-xs text-red-600">
            {errors.contact_officer_state}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          ZIP
        </label>
        <input
          type="text"
          className={inputClass("contact_officer_zip")}
          value={formData.contact_officer_zip || ""}
          onChange={(e) => {
            onChange("contact_officer_zip", e.target.value);
            onClearError("contact_officer_zip");
          }}
        />
        {errors.contact_officer_zip && (
          <p className="mt-1 text-xs text-red-600">
            {errors.contact_officer_zip}
          </p>
        )}
      </div>
    </div>
  );
};
