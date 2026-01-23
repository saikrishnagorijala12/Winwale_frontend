
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import {
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  EyeOff,
  Eye,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (formData.fullName.trim().length < 3) {
      return 'Full name must be at least 3 characters';
    }
    if (!emailRegex.test(formData.email)) {
      return 'Invalid email address';
    }
    if (!passwordRegex.test(formData.password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, and a number';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
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
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      if (err.name === 'UsernameExistsException') {
        setError('An account with this email already exists. Try signing in.');
      } else {
        setError(err.message || 'Signup failed');
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
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      // Handle the case where user is already confirmed
      if (err.message?.includes('Current status is CONFIRMED') || err.name === 'NotAuthorizedException') {
        setError('This account is already verified. Please sign in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.message || 'Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const title = step === 'details' ? 'Sign up' : 'Verify email';
  const subtitle =
    step === 'details'
      ? 'Join the Winvale Analysis Platform'
      : `Enter the code sent to ${formData.email}`;

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      {step === 'details' ? (
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
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your Name"
              />
            </div>
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
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Re-enter password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#3498db] hover:bg-[#2980b9] text-white font-semibold rounded-xl disabled:opacity-70 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign up'}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
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
            onClick={() => setStep('details')}
            className="w-full text-slate-500 text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to details
          </button>
        </form>
      )}

      <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;
