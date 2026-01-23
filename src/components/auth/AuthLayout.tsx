
import React from 'react';


interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Brand Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1d4e89] flex-col p-12 justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <img src="logo.png" alt='Winvale Logo' />
            </div>
          <span className="text-white text-2xl font-bold tracking-tight">Winvale</span> */}
        </div>

        <div className="mb-24">
          <h1 className="text-white text-6xl font-bold leading-tight">
            Winvale<br />
            <span className="text-blue-300">Automation Platform</span>
          </h1>
        </div>

        <div className="text-blue-200 text-sm">
          {/* &copy; 2024 Winvale Strategy & Consulting. All rights reserved. */}
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8fafc]">
        <div className="max-w-md w-full">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <img src="logo.png" alt='Winvale Logo' />
            </div>
            <span className="text-2xl font-bold text-slate-900">Winvale</span>
          </div>
          <div className="mb-10">
            <h2 className="text-3xl text-center font-bold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500 text-center">{subtitle}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
