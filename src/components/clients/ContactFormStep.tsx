import React, { useMemo, useState } from "react";
import { ClientFormData, EditingClient } from "../../types/client.types";

interface ContactFormStepProps {
  formData: ClientFormData | EditingClient;
  onChange: (field: keyof ClientFormData, value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const ContactFormStep: React.FC<ContactFormStepProps> = ({
  formData,
  onChange,
  onValidationChange,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!formData.contact_officer_name?.trim()) {
      e.contact_officer_name = "Primary contact name is required.";
    }

    if (!formData.contact_officer_email?.trim()) {
      e.contact_officer_email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.contact_officer_email,
      )
    ) {
      e.contact_officer_email = "Please enter a valid email address.";
    }

    if (!formData.contact_officer_phone_no?.trim()) {
      e.contact_officer_phone_no = "Phone number is required.";
    } else if (
      !/^\+?[0-9\s\-()]{7,}$/.test(
        formData.contact_officer_phone_no,
      )
    ) {
      e.contact_officer_phone_no = "Please enter a valid phone number.";
    }

    const isValid = Object.keys(e).length === 0;
    if (onValidationChange) {
      onValidationChange(isValid);
    }

    return e;
  }, [formData, onValidationChange]);

  const showError = (field: keyof ClientFormData) =>
    touched[field] && errors[field];

  const inputClass = (field: keyof ClientFormData) =>
    `w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${
      showError(field) ? "border-red-500" : "border-slate-200 focus:border-[#38A1DB]"
    }`;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Primary Contact Name */}
      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Primary Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className={inputClass("contact_officer_name")}
          value={formData.contact_officer_name}
          onChange={(e) =>
            onChange("contact_officer_name", e.target.value)
          }
          onBlur={() =>
            setTouched((t) => ({
              ...t,
              contact_officer_name: true,
            }))
          }
          aria-invalid={!!showError("contact_officer_name")}
        />
        {showError("contact_officer_name") && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.contact_officer_name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          className={inputClass("contact_officer_email")}
          value={formData.contact_officer_email}
          onChange={(e) =>
            onChange("contact_officer_email", e.target.value)
          }
          onBlur={() =>
            setTouched((t) => ({
              ...t,
              contact_officer_email: true,
            }))
          }
          aria-invalid={!!showError("contact_officer_email")}
        />
        {showError("contact_officer_email") && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.contact_officer_email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          required
          className={inputClass("contact_officer_phone_no")}
          value={formData.contact_officer_phone_no}
          onChange={(e) =>
            onChange("contact_officer_phone_no", e.target.value)
          }
          onBlur={() =>
            setTouched((t) => ({
              ...t,
              contact_officer_phone_no: true,
            }))
          }
          aria-invalid={!!showError("contact_officer_phone_no")}
        />
        {showError("contact_officer_phone_no") && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.contact_officer_phone_no}
          </p>
        )}
      </div>

      {/* Optional Fields */}
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
            value={(formData as any)[field]}
            onChange={(e) =>
              onChange(field as keyof ClientFormData, e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
};