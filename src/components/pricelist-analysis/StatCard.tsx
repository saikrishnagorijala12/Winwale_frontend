import React, { useEffect, useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant?: "emerald" | "red" | "amber" | "cyan" | "blue" | "slate";
  isActive?: boolean;
  onClick?: () => void;
}

export const StatCard = ({
  label,
  value,
  icon,
  variant = "blue",
  isActive = false,
  onClick,
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
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
      accent: "bg-emerald-500",
      bg: "bg-emerald-50/40",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100/50",
      shadow: "shadow-emerald-200/40",
      activeBorder: "border-emerald-200",
    },
    red: {
      accent: "bg-red-500",
      bg: "bg-red-50/40",
      text: "text-red-700",
      iconBg: "bg-red-100/50",
      shadow: "shadow-red-200/40",
      activeBorder: "border-red-200",
    },
    amber: {
      accent: "bg-amber-500",
      bg: "bg-amber-50/40",
      text: "text-amber-700",
      iconBg: "bg-amber-100/50",
      shadow: "shadow-amber-200/40",
      activeBorder: "border-amber-200",
    },
    cyan: {
      accent: "bg-[#3399cc]",
      bg: "bg-cyan-50/40",
      text: "text-[#2980b9]",
      iconBg: "bg-cyan-100/50",
      shadow: "shadow-cyan-200/40",
      activeBorder: "border-cyan-200",
    },
    blue: {
      accent: "bg-blue-500",
      bg: "bg-blue-50/40",
      text: "text-blue-700",
      iconBg: "bg-blue-100/50",
      shadow: "shadow-blue-200/40",
      activeBorder: "border-blue-200",
    },
    slate: {
      accent: "bg-slate-600",
      bg: "bg-slate-100/80",
      text: "text-slate-700",
      iconBg: "bg-slate-200/50",
      shadow: "shadow-slate-300/40",
      activeBorder: "border-slate-300",
    },
  };

  const theme = themes[variant];

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl p-5 
        transition-all duration-300 ease-out 
        backdrop-blur-md border 
        ${onClick ? "cursor-pointer select-none" : ""}
        ${isActive
          ? `${theme.bg} ${theme.shadow} ${theme.activeBorder} shadow-sm`
          : "bg-white/80 border-slate-200/50 shadow-sm hover:shadow-md hover:border-slate-300"
        }
      `}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`
            w-11 h-11 rounded-xl transition-all duration-300
            flex items-center justify-center 
            ${theme.iconBg} ${theme.text}
          `}
        >
          {React.cloneElement(icon as React.ReactElement, { size: 18 } as any)}
        </div>

        <div className="flex flex-col">
          <p className={`text-2xl font-black tabular-nums transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-700"}`}>
            {displayValue.toLocaleString()}
          </p>

          <p className={`text-[10px] font-bold uppercase tracking-[0.12em] mt-1 transition-colors duration-300
            ${isActive ? theme.text : "text-slate-400"}
          `}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};
