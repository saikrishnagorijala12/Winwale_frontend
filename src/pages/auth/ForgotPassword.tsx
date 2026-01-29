
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
// import { Mail, Lock, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
// import AuthLayout from '../../components/auth/AuthLayout';

// const ForgotPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState<'request' | 'confirm'>('request');
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleRequest = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       await resetPassword({ username: email });
//       setStep('confirm');
//     } catch (err: any) {
//       setError(err.message || 'Request failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirm = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       await confirmResetPassword({
//         username: email,
//         confirmationCode: otp,
//         newPassword: newPassword
//       });
//       alert("Password successfully reset!");
//       navigate('/login');
//     } catch (err: any) {
//       setError(err.message || 'Reset failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const title = step === 'request' ? 'Reset password' : 'Set new password';
//   const subtitle = step === 'request' 
//     ? 'We will send a recovery code to your email' 
//     : `Enter the code and choose a new password`;

//   return (
//     <AuthLayout title={title} subtitle={subtitle}>
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
//           {error}
//         </div>
//       )}

//       {step === 'request' ? (
//         <form onSubmit={handleRequest} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-slate-400" />
//               </div>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
//                 placeholder="name@winvale.com"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
//           >
//             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Code"}
//             {!loading && <ArrowRight className="h-5 w-5" />}
//           </button>
//         </form>
//       ) : (
//         <form onSubmit={handleConfirm} className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">Recovery Code</label>
//             <input
//               type="text"
//               required
//               maxLength={6}
//               className="block w-full text-center text-2xl tracking-[0.5em] font-mono py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
//               placeholder="000000"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-slate-400" />
//               </div>
//               <input
//                 type="password"
//                 required
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
//                 placeholder="Min. 8 characters"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
//           >
//             {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
//             {!loading && <ArrowRight className="h-5 w-5" />}
//           </button>
//         </form>
//       )}

//       <div className="mt-8 pt-6 border-t border-slate-100 text-center">
//         <Link to="/login" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
//           <ArrowLeft className="h-4 w-4 mr-2" /> Back to sign in
//         </Link>
//       </div>
//     </AuthLayout>
//   );
// };

// export default ForgotPassword;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { Mail, Lock, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { passwordRules } from "../../utils/passwordRules";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFailedRules = Object.values(passwordRules).some(
    (rule) => !rule.test(newPassword)
  );

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await resetPassword({ username: email });
      setStep("confirm");
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (hasFailedRules) {
      setError("Password does not meet all requirements");
      return;
    }

    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Reset failed");
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
        <form onSubmit={handleRequest} className="space-y-6">
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
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="name@winvale.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Code"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Recovery Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              className="block w-full text-center text-2xl tracking-[0.5em] font-mono py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
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
                required
                autoComplete="new-password"
                name="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Min. 8 characters"
              />
            </div>

            {/* Animated checklist */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                passwordFocused &&
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
