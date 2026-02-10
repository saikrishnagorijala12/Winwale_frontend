import React from "react";
import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../../types/client.types";

interface CompanyFormStepProps {
  formData: ClientFormData | EditingClient;
  errors: ClientFormErrors;
  onChange: (field: keyof ClientFormData, value: string) => void;
  onClearError: (field: keyof ClientFormErrors) => void;
}

export const CompanyFormStep: React.FC<CompanyFormStepProps> = ({
  formData,
  errors,
  onChange,
  onClearError,
}) => {
  const inputClass = (field: keyof ClientFormErrors) =>
    `w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none border-slate-200 focus:border-[#38A1DB]"
    `;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Company Name */}
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className={inputClass("company_name")}
          value={formData.company_name}
          onChange={(e) => {
            onChange("company_name", e.target.value);
            onClearError("company_name");
          }}
          aria-invalid={!!errors.company_name}
        />
        {errors.company_name && (
          <p className="mt-1 text-xs text-red-600">
            {errors.company_name}
          </p>
        )}
      </div>

      {/* Company Email */}
      <div>
        <label className="text-sm font-bold text-slate-700">
          Company Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          className={inputClass("company_email")}
          value={formData.company_email}
          onChange={(e) => {
            onChange("company_email", e.target.value);
            onClearError("company_email");
          }}
          aria-invalid={!!errors.company_email}
        />
        {errors.company_email && (
          <p className="mt-1 text-xs text-red-600">
            {errors.company_email}
          </p>
        )}
      </div>

      {/* Company Phone */}
      <div>
        <label className="text-sm font-bold text-slate-700">
          Company Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          required
          className={inputClass("company_phone_no")}
          value={formData.company_phone_no}
          onChange={(e) => {
            onChange("company_phone_no", e.target.value);
            onClearError("company_phone_no");
          }}
          aria-invalid={!!errors.company_phone_no}
        />
        {errors.company_phone_no && (
          <p className="mt-1 text-xs text-red-600">
            {errors.company_phone_no}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Company Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className={inputClass("company_address")}
          value={formData.company_address}
          onChange={(e) => {
            onChange("company_address", e.target.value);
            onClearError("company_address");
          }}
          aria-invalid={!!errors.company_address}
        />
        {errors.company_address && (
          <p className="mt-1 text-xs text-red-600">
            {errors.company_address}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="text-sm font-bold text-slate-700">
          City <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className={inputClass("company_city")}
          value={formData.company_city}
          onChange={(e) => {
            onChange("company_city", e.target.value);
            onClearError("company_city");
          }}
          aria-invalid={!!errors.company_city}
        />
        {errors.company_city && (
          <p className="mt-1 text-xs text-red-600">
            {errors.company_city}
          </p>
        )}
      </div>

      {/* State */}
      <div>
        <label className="text-sm font-bold text-slate-700">
          State <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className={inputClass("company_state")}
          value={formData.company_state}
          onChange={(e) => {
            onChange("company_state", e.target.value);
            onClearError("company_state");
          }}
          aria-invalid={!!errors.company_state}
        />
        {errors.company_state && (
          <p className="mt-1 text-xs text-red-600">
            {errors.company_state}
          </p>
        )}
      </div>

      {/* ZIP */}
      <div>
        <label className="text-sm font-bold text-slate-700">
          ZIP <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className={inputClass("company_zip")}
          value={formData.company_zip}
          onChange={(e) => {
            onChange("company_zip", e.target.value);
            onClearError("company_zip");
          }}
          aria-invalid={!!errors.company_zip}
        />
        {errors.company_zip && (
          <p className="mt-1 text-xs text-red-600">
            {errors.company_zip}
          </p>
        )}
      </div>
    </div>
  );
};