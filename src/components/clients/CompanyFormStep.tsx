import React from "react";
import { Building2, Upload, X, Image as ImageIcon } from "lucide-react";
import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../../types/client.types";

interface CompanyFormStepProps {
  formData: ClientFormData | EditingClient;
  errors: ClientFormErrors;
  onChange: (field: keyof ClientFormData, value: any) => void;
  onClearError: (field: keyof ClientFormErrors) => void;
}

export const CompanyFormStep: React.FC<CompanyFormStepProps> = ({
  formData,
  errors,
  onChange,
  onClearError,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange("logoFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange("logoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("logoFile", null);
    onChange("logoUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const inputClass = (field: keyof ClientFormErrors) =>
    `w-full mt-2 px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none border-slate-200 focus:border-[#38A1DB]"
    }`;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="md:col-span-2 flex items-center gap-6 p-5 bg-slate-50/50 border border-slate-200 rounded-2xl mb-2">
        <div className="relative group">
          <div
            className={`w-24 h-24 rounded-2xl border-2 overflow-hidden bg-white flex items-center justify-center transition-all ${
              !formData.logoUrl
                ? "border-dashed border-slate-300"
                : "border-solid border-white"
            }`}
          >
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                alt="Logo Preview"
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Building2 className="w-10 h-10 text-slate-300" />
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white"
          >
            <Upload className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-800">Company Logo</h4>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            PNG, JPG or SVG (max 2MB)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-[#38A1DB] transition-all flex items-center gap-2 shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#38A1DB]" />
              {formData.logoUrl ? "Change Logo" : "Upload Logo"}
            </button>

            {formData.logoUrl && (
              <button
                type="button"
                onClick={removeLogo}
                className="px-3 py-2 text-red-500 hover:bg-red-50/50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={inputClass("company_name")}
          value={formData.company_name}
          onChange={(e) => {
            onChange("company_name", e.target.value);
            onClearError("company_name");
          }}
        />
        {errors.company_name && (
          <p className="mt-1 text-xs text-red-600 ">
            {errors.company_name}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Company Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          className={inputClass("company_email")}
          value={formData.company_email}
          onChange={(e) => {
            onChange("company_email", e.target.value);
            onClearError("company_email");
          }}
        />
        {errors.company_email && (
          <p className="mt-1 text-xs text-red-600 ">
            {errors.company_email}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Company Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          className={inputClass("company_phone_no")}
          value={formData.company_phone_no}
          onChange={(e) => {
            onChange("company_phone_no", e.target.value);
            onClearError("company_phone_no");
          }}
        />
        {errors.company_phone_no && (
          <p className="mt-1 text-xs text-red-600 ">
            {errors.company_phone_no}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Company Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={inputClass("company_address")}
          value={formData.company_address}
          onChange={(e) => {
            onChange("company_address", e.target.value);
            onClearError("company_address");
          }}
        />
        {errors.company_address && (
          <p className="mt-1 text-xs text-red-600 ">
            {errors.company_address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 md:col-span-2 gap-4">
        <div className="col-span-1">
          <label className="text-sm font-bold text-slate-700">
            City<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClass("company_city")}
            value={formData.company_city}
            onChange={(e) => {onChange("company_city", e.target.value);
            onClearError("company_city");}}
          />
          {errors.company_city && (
            <p className="mt-1 text-xs text-red-600 ">
              {errors.company_city}
            </p>
          )}
        </div>
        <div className="col-span-1">
          <label className="text-sm font-bold text-slate-700">
            State<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClass("company_state")}
            value={formData.company_state}
            onChange={(e) => {onChange("company_state", e.target.value);
            onClearError("company_state");}}
          />
          {errors.company_state && (
            <p className="mt-1 text-xs text-red-600 ">
              {errors.company_state}
            </p>
          )}
        </div>
        <div className="col-span-1">
          <label className="text-sm font-bold text-slate-700">
            ZIP<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClass("company_zip")}
            value={formData.company_zip}
            onChange={(e) => {onChange("company_zip", e.target.value);
            onClearError("company_zip");}}
          />
          {errors.company_zip && (
            <p className="mt-1 text-xs text-red-600 ">
              {errors.company_zip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
