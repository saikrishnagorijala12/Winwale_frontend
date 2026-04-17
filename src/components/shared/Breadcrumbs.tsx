import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.15em] mb-4 ${className}`}>
      {/* Home link could be dashboard if we want, but let's stick to the items provided */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight size={10} className="text-slate-300 shrink-0" />
            )}
            
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-slate-400 hover:text-[#38A1DB] transition-colors whitespace-nowrap cursor-pointer uppercase font-black tracking-[0.15em]"
              >
                {item.label}
              </button>
            ) : item.path && !isLast ? (
              <Link
                to={item.path}
                className="text-slate-400 hover:text-[#38A1DB] transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`${isLast ? "text-slate-600 font-black" : "text-slate-400"} whitespace-nowrap`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
