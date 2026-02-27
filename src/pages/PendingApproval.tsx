import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
 
const PendingApproval: React.FC = () => {
  const { refreshUser, logout } = useAuth();
 
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser().catch(() => {});
    }, 20000);
 
    return () => clearInterval(interval);
  }, [refreshUser]);
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7] px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-md p-10 text-center">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Winvale" className="h-9 object-contain" />
        </div>

        <p className="text-base text-slate-800 leading-relaxed">
          <span className="font-semibold">
            Your account has been created and is awaiting approval.
          </span>
          <br />
          <br />
          Access to the system will be enabled once your request has been
          reviewed and approved by the{" "}
          <span className="font-semibold">Winvale Administration team</span>.
        </p>

        <div className="mt-10">
          <button onClick={logout} className="w-full btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default PendingApproval;