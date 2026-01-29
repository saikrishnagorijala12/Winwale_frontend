import React, { useState } from "react";
import { Lock, ChevronRight, X } from "lucide-react";
import { passwordRules } from "../../utils/passwordRules";

interface PasswordSectionProps {
  onUpdate: (current: string, next: string, confirm: string) => Promise<boolean>;
  loading: boolean;
}

const inputStyles =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#3498db]/10 focus:border-[#3498db] transition-all bg-slate-50/50 text-slate-700";

export const PasswordSection = ({ onUpdate, loading }: PasswordSectionProps) => {
  const [isChanging, setIsChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);

  const hasFailedRules = Object.values(passwordRules).some(
    (rule) => !rule.test(newPassword)
  );

  const handleSubmit = async () => {
    const success = await onUpdate(
      currentPassword,
      newPassword,
      confirmPassword
    );
    if (success) {
      setIsChanging(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNewPasswordFocused(false);
    }
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden">
      {!isChanging ? (
        <div
          className="p-8 flex items-center justify-between cursor-pointer"
          onClick={() => setIsChanging(true)}
        >
          <div className="flex items-center gap-4">
            <Lock className="w-6 h-6 text-slate-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Password</h3>
              <p className="text-sm text-slate-500">
                Change your account password
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#3498db]" />
        </div>
      ) : (
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">
              Update Password
            </h3>
            <button onClick={() => setIsChanging(false)}>
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <input
            type="password"
            className={inputStyles}
            autoComplete="current-password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div>
            <input
              type="password"
              className={inputStyles}
              autoComplete="new-password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
            />

            {/*  checklist */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                newPasswordFocused &&
                newPassword.length > 0 &&
                hasFailedRules
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <ul className="mt-3 space-y-1 text-sm">
                {Object.entries(passwordRules).map(([key, rule]) => {
                  const passed = rule.test(newPassword);

                  return (
                    <li
                      key={key}
                      className={`flex items-center gap-2 ${
                        passed ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-xs ${
                          passed
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {passed ? "✓" : ""}
                      </span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <input
            type="password"
            className={inputStyles}
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              Update Password
            </button>
            <button
              onClick={() => setIsChanging(false)}
              className="px-6 py-2.5 font-bold text-slate-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
