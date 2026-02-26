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
  X,
} from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { validateSignupForm } from "@/src/utils/authValidators";
import { PASSWORD_RULES as passwordRules } from "@/src/utils/validators";

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};


const PasswordChecklist: React.FC<{ password: string }> = ({ password }) => {
  return (
    <ul className="mt-3 space-y-1 text-sm">
      {Object.entries(passwordRules).map(([key, rule]) => {
        const passed = rule.test(password);

        return (
          <li
            key={key}
            className={`flex items-center gap-2 ${passed ? "text-green-600" : "text-slate-400"
              }`}
          >
            <span
              className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-xs ${passed
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
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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
        username: formData.email.trim(),
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email.trim(),
            name: formData.fullName.trim(),
          },
        },
      });

      // Redirect to shared verification page
      navigate(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`, {
        state: { password: formData.password }
      });
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

  const title = "Sign up";
  const subtitle = "Company employees only – use your @winvale.com email";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center justify-between">
          <div className="flex-1">
            {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-500 hover:text-red-700 transition-colors p-1 rounded-md hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
                setError(null);
              }}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
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
                setError(null);
              }}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
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
                setError(null);
              }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
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
            className={`overflow-hidden transition-all duration-300 ease-in-out ${passwordFocused &&
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
                setError(null);
              }}
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
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
