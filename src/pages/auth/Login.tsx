import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { signIn, confirmSignIn } from "aws-amplify/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Phone,
  Key,
  ArrowLeft,
  QrCode,
  Copy,
  ChevronRight,
} from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { getCurrentUser } from "../../api/user";
import QRCode from "qrcode";
 
interface LoginProps {
  onAuthSuccess: () => void;
}
 
type AuthStep =
  | "credentials"
  | "mfa-sms"
  | "mfa-totp"
  | "totp-setup-qr"
  | "totp-setup-verify";
 
const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>("credentials");
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
 
  const isAuthProcessed = useRef(false);
 
  useEffect(() => {
    if (authStep === "totp-setup-qr" && totpSecret && email) {
      const issuer = "Winvale";
      const encodedIssuer = encodeURIComponent(issuer);
      const encodedEmail = encodeURIComponent(email);
      const otpauthUrl = `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${totpSecret}&issuer=${encodedIssuer}`;
 
      QRCode.toDataURL(otpauthUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("Error generating QR code", err));
    }
  }, [authStep, totpSecret, email]);
 
  const handleNextStep = async (nextStep: any) => {
    // Prevent state update if already processing completion
    if (isAuthProcessed.current) return;
 
    if (nextStep.signInStep === "DONE") {
      isAuthProcessed.current = true;
      try {
        await getCurrentUser(); 
        onAuthSuccess(); 
      } catch (err) {
        setError("Login successful, but profile could not be loaded.");
      } finally {
        setLoading(false);
      }
      return;
    }
    setMfaCode("");
 
    switch (nextStep.signInStep) {
      case "CONFIRM_SIGN_IN_WITH_SMS_MFA":
        setAuthStep("mfa-sms");
        break;
 
      case "CONFIRM_SIGN_IN_WITH_TOTP_MFA":
      case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
        setAuthStep("mfa-totp");
        break;
 
      case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
        setTotpSecret(nextStep.totpSetupDetails?.sharedSecret);
        setAuthStep("totp-setup-qr");
        break;
 
      default:
        setError(
          `An unexpected authentication state occurred: ${nextStep.signInStep}`
        );
        break;
    }
 
    setLoading(false);
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isAuthProcessed.current) return;
 
    setLoading(true);
    setError(null);
    try {
      const { nextStep } = await signIn({ username: email, password });
      handleNextStep(nextStep);
    } catch (err: any) {
      setError(
        err.message || "Failed to sign in. Please check your credentials."
      );
      setLoading(false);
    }
  };
 
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isAuthProcessed.current || mfaCode.length !== 6) return;
 
    setLoading(true);
    setError(null);
    try {
      const { nextStep } = await confirmSignIn({ challengeResponse: mfaCode });
      handleNextStep(nextStep);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please check the code.");
      setLoading(false);
    }
  };
 
  const copySecret = () => {
    if (totpSecret) {
      navigator.clipboard.writeText(totpSecret);
      const btn = document.getElementById("copy-btn");
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = "Copied!";
        setTimeout(() => {
          if (btn) btn.innerHTML = originalText;
        }, 2000);
      }
    }
  };
 
  const getStepConfig = () => {
    switch (authStep) {
      case "mfa-sms":
        return {
          title: "Verify phone",
          subtitle: "Enter the code sent to your mobile",
          buttonText: "Verify Identity",
        };
      case "mfa-totp":
        return {
          title: "Authenticator",
          subtitle: "Enter the 6-digit code from your app",
          buttonText: "Verify Code",
        };
      case "totp-setup-qr":
        return {
          title: "Link Authenticator",
          subtitle: "Step 1: Scan the code below",
          buttonText: "Continue to Verify",
        };
      case "totp-setup-verify":
        return {
          title: "Verify Setup",
          subtitle: "Step 2: Enter the verification code",
          buttonText: "Complete Setup",
        };
      default:
        return {
          title: "Welcome back",
          subtitle: "Sign in to access your dashboard",
          buttonText: "Sign in",
        };
    }
  };
 
  const config = getStepConfig();
 
  return (
    <AuthLayout title={config.title} subtitle={config.subtitle}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}
 
      {authStep === "credentials" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="name@winvale.com"
              />
            </div>
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
          </div>
 
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              title="Recover your password"
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
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              config.buttonText
            )}
          </button>
        </form>
      ) : authStep === "totp-setup-qr" ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="MFA QR Code"
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-xl">
                  <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center">
              Scan this QR code with your authenticator app (e.g., Google
              Authenticator, Authy).
            </p>
          </div>
 
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Manual Entry Key
            </label>
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
              <code className="text-sm font-mono text-slate-900 truncate">
                {totpSecret}
              </code>
              <button
                id="copy-btn"
                type="button"
                onClick={copySecret}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold text-blue-600"
                title="Copy Key"
              >
                <Copy className="h-4 w-4 inline mr-1" /> Copy
              </button>
            </div>
          </div>
 
          <button
            type="button"
            onClick={() => {
              setMfaCode("");
              setAuthStep("totp-setup-verify");
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
          >
            {config.buttonText} <ChevronRight className="h-5 w-5" />
          </button>
 
          <button
            type="button"
            onClick={() => setAuthStep("credentials")}
            className="w-full text-slate-500 text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel setup
          </button>
        </div>
      ) : (
        <form onSubmit={handleMfaSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <ShieldCheck className="h-8 w-8" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 text-center">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                className="block w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-3xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="000000"
                disabled={loading}
              />
            </div>
          </div>
 
          <button
            type="submit"
            disabled={loading || mfaCode.length !== 6}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              config.buttonText
            )}
          </button>
 
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setError(null);
              setAuthStep(totpSecret ? "totp-setup-qr" : "credentials");
            }}
            className="w-full text-slate-500 text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </form>
      )}
 
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
 