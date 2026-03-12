import React, { useEffect, useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "emerald" | "red" | "amber" | "cyan" | "blue";
}

export const StatCard = ({
  label,
  value,
  icon,
  variant = "blue",
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // animation speed
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const themes = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      iconBg: "bg-emerald-100/50",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-100",
      iconBg: "bg-red-100/50",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      iconBg: "bg-amber-100/50",
    },
    cyan: {
      bg: "bg-cyan-50",
      text: "text-[#3399cc]",
      border: "border-cyan-100",
      iconBg: "bg-cyan-100/50",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      iconBg: "bg-blue-100/50",
    },
  };

  const theme = themes[variant];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-lg hover:shadow-slate-200/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-transparent hover:ring-slate-200/50 group">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center ${theme.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}
        >
          {React.cloneElement(icon as React.ReactElement, { size: 20 } as any)}
        </div>

        <div>
          <p className="text-2xl font-black text-slate-900 tabular-nums leading-none tracking-tight">
            {displayValue.toLocaleString()}
          </p>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 transition-colors group-hover:text-slate-500">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};
