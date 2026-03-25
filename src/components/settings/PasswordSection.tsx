import React, { useState } from "react";
import { Lock, ChevronRight, X, Eye, EyeOff } from "lucide-react";
import { PASSWORD_RULES as passwordRules, validatePasswordComplexity, validateMatch } from "../../utils/validators";

interface PasswordSectionProps {
  onUpdate: (
    current: string,
    next: string,
    confirm: string,
  ) => Promise<boolean>;
  loading: boolean;
}

const inputStyles =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#3498db] transition-all bg-slate-50/50 text-slate-700";

export const PasswordSection = ({
  onUpdate,
  loading,
}: PasswordSectionProps) => {
  const [isChanging, setIsChanging] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPasswordFocused, setNewPasswordFocused] = useState(false);

  const [currentError, setCurrentError] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const hasFailedRules = Object.values(passwordRules).some(
    (rule) => !rule.test(newPassword),
  );

  const resetErrors = () => {
    setCurrentError("");
    setNewError("");
    setConfirmError("");
  };

  const handleSubmit = async () => {
    resetErrors();

    if (!currentPassword) {
      setCurrentError("Current password is required");
      return;
    }

    const complexityErr = validatePasswordComplexity(newPassword);
    if (complexityErr) {
      setNewError(complexityErr);
      return;
    }

    const matchErr = validateMatch(newPassword, confirmPassword, "Passwords");
    if (matchErr) {
      setConfirmError(matchErr);
      return;
    }

    const success = await onUpdate(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    if (!success) {
      setCurrentError("Current password is incorrect");
      return;
    }

    resetForm();
  };

  const resetForm = () => {
    setIsChanging(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);

    setNewPasswordFocused(false);
    resetErrors();
  };

  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between p-8 text-left transition-colors duration-200 hover:bg-slate-50/60"
        onClick={() => setIsChanging((value) => !value)}
        aria-expanded={isChanging}
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
        <ChevronRight
          className={`w-4 h-4 text-[#3498db] transition-transform duration-300 ease-out ${isChanging ? "rotate-90" : "rotate-0"}`}
        />
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${isChanging ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0">
          <div className="space-y-6 px-8 pb-8">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={`${inputStyles} ${currentError ? "border-red-500" : ""} pr-10`}
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setCurrentError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {currentError && (
                <p className="mt-1 ml-1 text-xs text-red-600">{currentError}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className={`${inputStyles} ${newError ? "border-red-500" : ""} pr-10`}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewError("");
                  }}
                  onFocus={() => setNewPasswordFocused(true)}
                  onBlur={() => setNewPasswordFocused(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {newError && (
                <p className="mt-1 ml-1 text-xs text-red-600">{newError}</p>
              )}

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${newPasswordFocused && newPassword.length > 0 && hasFailedRules ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <ul className="mt-3 space-y-1 text-sm">
                  {Object.entries(passwordRules).map(([key, rule]) => {
                    const passed = rule.test(newPassword);
                    return (
                      <li
                        key={key}
                        className={`flex items-center gap-2 ${passed ? "text-green-600" : "text-slate-400"}`}
                      >
                        <span
                          className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-xs ${passed ? "border-green-600 bg-green-600 text-white" : "border-slate-300"}`}
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

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`${inputStyles} ${confirmError ? "border-red-500" : ""} pr-10`}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {confirmError && (
                <p className="mt-1 ml-1 text-xs text-red-600">{confirmError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 font-bold text-slate-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
