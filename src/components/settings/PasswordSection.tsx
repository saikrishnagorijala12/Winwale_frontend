import React, { useState } from "react";
import { Lock, ChevronRight, X, Eye, EyeOff } from "lucide-react";
import { passwordRules } from "../../utils/passwordRules";

interface PasswordSectionProps {
  onUpdate: (
    current: string,
    next: string,
    confirm: string,
  ) => Promise<boolean>;
  loading: boolean;
}

const inputStyles =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#3498db]/10 focus:border-[#3498db] transition-all bg-slate-50/50 text-slate-700";

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

    if (!newPassword) {
      setNewError("New password is required");
      return;
    }

    if (hasFailedRules) {
      setNewError("Password does not meet all requirements");
      return;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmError("Passwords do not match");
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
            <button onClick={resetForm}>
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Current password */}
          <div>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                className={`${inputStyles} ${
                  currentError ? "border-red-500" : ""
                } pr-10`}
                autoComplete="current-password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setCurrentError("");
                }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {currentError && (
              <p className="text-xs text-red-600 mt-1 ml-1">{currentError}</p>
            )}
          </div>

          {/* New password */}
          <div>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                className={`${inputStyles} ${
                  newError ? "border-red-500" : ""
                } pr-10`}
                autoComplete="new-password"
                placeholder="New password"
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
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {newError && (
              <p className="text-xs text-red-600 mt-1 ml-1">{newError}</p>
            )}

            {/* Password checklist */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                newPasswordFocused && newPassword.length > 0 && hasFailedRules
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

          {/* Confirm password */}
          <div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className={`${inputStyles} ${
                  confirmError ? "border-red-500" : ""
                } pr-10`}
                autoComplete="new-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmError("");
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {confirmError && (
              <p className="text-xs text-red-600 mt-1 ml-1">{confirmError}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
            >
              Update Password
            </button>
            <button
              onClick={resetForm}
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
