import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { confirmSignUp, resendSignUpCode, signIn } from "aws-amplify/auth";
import { Mail, ArrowLeft, Loader2, CheckCircle2, X } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get("email");
        if (emailParam) {
            setEmail(emailParam);
        } else {
            navigate("/login");
        }

        if (location.state?.password) {
            setPassword(location.state.password);
        }
    }, [location, navigate]);

    const handleConfirmOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await confirmSignUp({
                username: email.trim(),
                confirmationCode: otp.trim(),
            });

            if (password) {
                setSuccess("Email verified! Logging you in...");
                try {
                    await signIn({
                        username: email.trim(),
                        password: password,
                    });
                    await refreshUser();
                    navigate("/dashboard");
                    return;
                } catch (loginErr: any) {
                    console.error("Auto-login failed:", loginErr);
                    setSuccess("Email verified successfully! Please sign in.");
                    setTimeout(() => navigate("/login"), 2000);
                }
            } else {
                setSuccess("Email verified successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (err: any) {
            if (
                err.name === "NotAuthorizedException" ||
                err.message?.includes("Current status is CONFIRMED")
            ) {
                setError("This account is already verified. Please sign in.");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(err.message || "Verification failed. Please check the code and try again.");
            }
        } finally {
            if (!success) setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResending(true);
        setError(null);
        setSuccess(null);

        try {
            await resendSignUpCode({ username: email.trim() });
            setSuccess("A new verification code has been sent to your email.");
        } catch (err: any) {
            setError(err.message || "Failed to resend code. Please try again later.");
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout title="Verify your email" subtitle={`Enter the code sent to ${email}`}>
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

            {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {success}
                    </div>
                    <button
                        onClick={() => setSuccess(null)}
                        className="ml-3 text-green-500 hover:text-green-700 transition-colors p-1 rounded-md hover:bg-green-100"
                        aria-label="Dismiss success message"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleConfirmOtp} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Verification Code
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={6}
                        className="block w-full text-center text-3xl tracking-[0.5em] font-mono py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value.replace(/[^0-9]/g, ""));
                            setError(null);
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || resending}
                    className="w-full py-3 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Email"}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading || resending}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                        {resending ? "Sending..." : "Resend verification code"}
                    </button>
                </div>

                <Link
                    to="/login"
                    className="w-full text-slate-500 text-sm flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to login
                </Link>
            </form>
        </AuthLayout>
    );
};

export default VerifyEmail;
