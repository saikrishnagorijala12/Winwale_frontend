import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import {
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  User,
  EyeOff,
  Eye,
} from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { validateSignupForm } from "@/src/utils/authValidators";
import { passwordRules } from "@/src/utils/passwordRules";

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PasswordChecklist: React.FC<{ password: string }> = ({ password }) => {
  return (
    <ul className="mt-3 space-y-1 text-sm">
      {Object.entries(passwordRules).map(([key, rule]) => {
        const passed = rule.test(password);

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
  );
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const hasFailedRules = Object.values(passwordRules).some(
    (rule) => !rule.test(formData.password),
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateSignupForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            name: formData.fullName,
          },
        },
      });
      setStep("otp");
    } catch (err: any) {
      if (err.name === "UsernameExistsException") {
        setError("An account with this email already exists. Try signing in.");
      } else {
        setError(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await confirmSignUp({
        username: formData.email,
        confirmationCode: otp,
      });
      navigate("/login");
    } catch (err: any) {
      if (
        err.message?.includes("Current status is CONFIRMED") ||
        err.name === "NotAuthorizedException"
      ) {
        setError("This account is already verified. Please sign in.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const title = step === "details" ? "Sign up" : "Verify email";
  const subtitle =
    step === "details"
      ? "Join the Winvale Analysis Platform"
      : `Enter the code sent to ${formData.email}`;

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === "details" ? (
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  clearError("fullName");
                  setFormData({ ...formData, fullName: e.target.value });
                }}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your Name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  clearError("email");
                  setFormData({ ...formData, email: e.target.value });
                }}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="name@winvale.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  clearError("password");
                  setFormData({ ...formData, password: e.target.value });
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Min. 8 characters"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                passwordFocused &&
                hasFailedRules &&
                formData.password.length > 0
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <PasswordChecklist password={formData.password} />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  clearError("confirmPassword");
                  setFormData({ ...formData, confirmPassword: e.target.value });
                }}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Re-enter password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl disabled:opacity-70 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign up"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              className="block w-full text-center text-3xl tracking-[0.5em] font-mono py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-[0.98]"
          >
            Confirm Registration
          </button>

          <button
            type="button"
            onClick={() => setStep("details")}
            className="w-full text-slate-500 text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to details
          </button>
        </form>
      )}

      <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;
