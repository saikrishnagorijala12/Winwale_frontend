import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { passwordRules } from "../../utils/passwordRules";
import { validateEmail } from "@/src/utils/validators";

interface FormErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const hasFailedRules = Object.values(passwordRules).some(
    (rule) => !rule.test(newPassword),
  );

  const validateRequest = () => {
    const newErrors: FormErrors = {};
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateConfirm = () => {
    const newErrors: FormErrors = {};

    if (!otp.trim()) newErrors.otp = "Recovery code is required";
    if (!newPassword.trim()) newErrors.newPassword = "New password is required";
    else if (hasFailedRules)
      newErrors.newPassword = "Password does not meet requirements";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateRequest()) return;

    setLoading(true);
    try {
      await resetPassword({ username: email });
      setStep("confirm");
    } catch (err: any) {
      if (err?.name === "UserNotFoundException") {
        setError("Email does not exist");
      } else {
        setError("Unable to process your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateConfirm()) return;

    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const title = step === "request" ? "Reset password" : "Set new password";
  const subtitle =
    step === "request"
      ? "We will send a recovery code to your email"
      : "Enter the code and choose a new password";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === "request" ? (
        <form onSubmit={handleRequest} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                className="block w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all bg-slate-50 border border-slate-200 focus:ring-blue-500"
                placeholder="name@winvale.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Send Code"
            )}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Recovery Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setErrors((p) => ({ ...p, otp: undefined }));
              }}
              className="block w-full text-center text-2xl tracking-[0.5em] font-mono py-4 rounded-xl outline-none transition-all
              bg-slate-50 border border-slate-200 focus:ring-blue-500"
              placeholder="000000"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((p) => ({ ...p, newPassword: undefined }));
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="block w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all
                  bg-slate-50 border border-slate-200 focus:ring-blue-500"
                placeholder="Min. 8 characters"
              />
            </div>

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}

            <div
              className={`overflow-hidden transition-all duration-300 ${
                passwordFocused && newPassword.length > 0 && hasFailedRules
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Update Password"
            )}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
