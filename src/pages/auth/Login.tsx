import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, signOut } from "aws-amplify/auth";
import { Mail, Lock, Eye, EyeOff, Loader2, X } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validateRequired } from "@/src/utils/validators";

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const isAuthProcessed = useRef(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validateRequired(password, "Password");
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isAuthProcessed.current) return;

    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const { nextStep } = await signIn({
        username: email.trim(),
        password,
      });

      if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, {
          state: { password },
        });
        return;
      }

      isAuthProcessed.current = true;

      try {
        await refreshUser();
      } catch (refreshErr: any) {
        isAuthProcessed.current = false;
        const msg = refreshErr.message || "";
        if (!refreshErr.response) {
          setError("Server is currently unavailable. Please try again later.");
          return;
        }

        if (refreshErr.response.status >= 500) {
          setError("Server error. Please try again later.");
          return;
        }

        if (refreshErr.response.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }
        setError(
          refreshErr.response?.data?.message ||
            "Login successful, but profile could not be loaded.",
        );
      }
    } catch (err: any) {
      if (err.name === "UserNotConfirmedException") {
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, {
          state: { password },
        });
        return;
      }
      if (err?.message?.includes("There is already a signed in user")) {
        await signOut();
        const { nextStep: retryStep } = await signIn({
          username: email.trim(),
          password,
        });
        if (retryStep.signInStep === "CONFIRM_SIGN_UP") {
          navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, {
            state: { password },
          });
          return;
        }
        isAuthProcessed.current = true;
        await refreshUser();
        return;
      }
      setError(
        err?.message || "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your dashboard"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center justify-between">
          <div className="flex-1">{error}</div>
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-500 hover:text-red-700 transition-colors p-1 rounded-md hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
                setError(null);
              }}
              className="block w-full pl-11 pr-4 py-3 rounded-xl outline-none transition-all bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
                setError(null);
              }}
              className="block w-full pl-11 pr-11 py-3 rounded-xl outline-none transition-all bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
              placeholder="••••••••"
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
