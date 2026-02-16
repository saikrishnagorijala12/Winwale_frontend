import React from "react";

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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center ${theme.text}`}
                >
                    {React.cloneElement(icon as React.ReactElement, { size: 20 } as any)}
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
                        {value.toLocaleString()}
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};
