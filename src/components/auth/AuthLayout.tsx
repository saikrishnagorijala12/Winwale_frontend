import React from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side – Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1d4e89] to-[#163d6a] flex-col px-14 py-12">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <img src="logo.png" alt="Winvale Logo" className="w-8 h-8" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Winvale Automation Platform
          </span>
        </div>

        {/* Hero */}
        <div className="flex-1 flex items-center">
          <h1 className="text-white text-5xl font-extrabold leading-tight max-w-lg">
            <span className="text-blue-300 block">Automation</span>
            Platform
          </h1>
        </div>

        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} Winvale Strategy & Consulting
        </div>
      </div>

      {/* Right Side – Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
              <img src="logo.png" alt="Winvale Logo" className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Winvale
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {title}
            </h2>
            <p className="text-slate-500">{subtitle}</p>
          </div>

          {/* Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
