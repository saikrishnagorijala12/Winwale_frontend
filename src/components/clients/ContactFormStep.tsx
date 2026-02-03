import React from "react";
import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../../types/client.types";

interface ContactFormStepProps {
  formData: ClientFormData | EditingClient;
  onChange: (field: keyof ClientFormData, value: string) => void;
  errors: Record<string, string>;
  onClearError: (field: keyof ClientFormErrors) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{1,15}$/;
const ZIP_REGEX = /^[A-Za-z0-9]{1,7}$/;

export const ContactFormStep: React.FC<ContactFormStepProps> = ({
  formData,
  onChange,
  errors,
  onClearError,
}) => {
  const inputClass = () =>
    "w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none border-slate-200 focus:border-[#38A1DB]";

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Primary Contact Name */}
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Primary Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={inputClass()}
          value={formData.contact_officer_name}
          onChange={(e) => {
            const value = e.target.value;
            onChange("contact_officer_name", value);

            if (value.trim() && value.length <= 30) {
              onClearError("contact_officer_name");
            }
          }}
          aria-invalid={!!errors.contact_officer_name}
        />
        {errors.contact_officer_name && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.contact_officer_name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-bold text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className={inputClass()}
          value={formData.contact_officer_email}
          onChange={(e) => {
            const value = e.target.value;
            onChange("contact_officer_email", value);

            if (value.trim() && EMAIL_REGEX.test(value) && value.length <= 50) {
              onClearError("contact_officer_email");
            }
          }}
          aria-invalid={!!errors.contact_officer_email}
        />
        {errors.contact_officer_email && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.contact_officer_email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-bold text-slate-700">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          className={inputClass()}
          value={formData.contact_officer_phone_no}
          onChange={(e) => {
            const value = e.target.value;
            onChange("contact_officer_phone_no", value);

            if (PHONE_REGEX.test(value)) {
              onClearError("contact_officer_phone_no");
            }
          }}
          aria-invalid={!!errors.contact_officer_phone_no}
        />
        {errors.contact_officer_phone_no && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.contact_officer_phone_no}
          </p>
        )}
      </div>

      {/* Optional fields */}
      {[
        ["Address", "contact_officer_address"],
        ["City", "contact_officer_city"],
        ["State", "contact_officer_state"],
        ["ZIP", "contact_officer_zip"],
      ].map(([label, field]) => (
        <div
          key={field}
          className={field === "contact_officer_address" ? "md:col-span-2" : ""}
        >
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {label} <span className="text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#38A1DB] focus:outline-none transition-colors"
            value={(formData as any)[field] || ""}
            onChange={(e) => {
              const value = e.target.value;
              onChange(field as keyof ClientFormData, value);

              if (
                !value ||
                (field === "contact_officer_zip"
                  ? ZIP_REGEX.test(value)
                  : value.length <= 50)
              ) {
                onClearError(field as keyof ClientFormErrors);
              }
            }}
          />
          {errors[field] && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors[field]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
