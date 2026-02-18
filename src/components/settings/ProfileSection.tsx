import React, { useState } from "react";
import { Save, Shield } from "lucide-react";
import { Role } from "@/src/types/roles.types";
import * as v from "../../utils/validators";

interface ProfileSectionProps {
  user: any;
  onSave: (data: { fullName: string; phone: string | null }) => Promise<void>;
  loading: boolean;
}

const ROLE_MAP: Record<Role, string> = {
  admin: "Administrator",
  user: "Consultant",
};

const inputStyles =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3498db] transition-all bg-slate-50/50 text-slate-700";

const disabledInputStyles =
  "w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-500 cursor-not-allowed";

export const ProfileSection = ({
  user,
  onSave,
  loading,
}: ProfileSectionProps) => {
  const [name, setName] = useState(user?.name || "");

  const [phoneNo, setPhoneNo] = useState(
    user?.phone_no && user.phone_no !== "NA" ? user.phone_no : "",
  );
  const [nameError, setNameError] = useState("");
  const [formError, setFormError] = useState("");

  const [phoneError, setPhoneError] = useState("");

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phoneNo.trim();

    setNameError("");
    setPhoneError("");
    setFormError("");

    const nameError =
      v.validateMinLength(name, 3, "Full name") ||
      v.validateMaxLength(name, 30, "Full name") ||
      v.validateName(name) ||
      undefined;
    if (nameError) {
      setNameError(nameError);
      return;
    }

    if (trimmedPhone) {
      const phoneError = v.validatePhone(trimmedPhone);
      if (phoneError) {
        setPhoneError(phoneError);
        return;
      }
    }

    if (
      trimmedName === user?.name &&
      (trimmedPhone || null) === (user?.phone_no || null)
    ) {
      setFormError("No changes to save");
      return;
    }

    await onSave({
      fullName: trimmedName,
      phone: trimmedPhone === "" ? null : trimmedPhone,
    });
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNo(e.target.value);
    setPhoneError("");
    setFormError("");
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-3xl bg-[#3498db]/10 flex items-center justify-center text-4xl font-bold text-[#3498db] border-4 border-white shadow-xl">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-slate-900">{user?.name}</h3>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-slate-100 rounded-full">
              <Shield className="w-3.5 h-3.5 text-[#3498db]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {ROLE_MAP[user?.role] || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">
              Full Name
            </label>
            <input
              className={`${inputStyles} ${nameError ? "border-red-500" : ""}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
                setFormError("");
              }}
            />
            {nameError && (
              <p className="text-sm text-red-600 mt-1 ml-1">{nameError}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              name="email"
              className={disabledInputStyles}
              value={user?.email || ""}
              disabled
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">
              Phone Number
            </label>
            <input
              type="tel"
              autoComplete="tel"
              name="phone"
              className={`${inputStyles} ${phoneError ? "border-red-500" : ""}`}
              value={phoneNo}
              onChange={handlePhoneChange}
              placeholder="+1234567890"
            />

            {phoneError && (
              <p className="text-sm text-red-600 mt-1 ml-1">{phoneError}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">
              Status
            </label>
            <input
              className={disabledInputStyles}
              value={user?.is_active ? "Active" : "Inactive"}
              disabled
            />
          </div>
        </div>
        {formError && (
          <div className="w-full bg-red-50 p-4 border-l-4 border-red-600">
            <p className="text-sm text-red-600">{formError}</p>
          </div>
        )}
        {/* Actions */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};
