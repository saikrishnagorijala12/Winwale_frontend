import { Plus, Trash2, TrendingUp, TrendingDown, FileEdit, ChevronRight } from "lucide-react";
import { useDocument } from "@/src/context/DocumentContext";
import { DocumentTypeCardProps } from "@/src/types/document.types";
import { documentConfigs } from "@/src/types/documentConfigs";
import { useSearchParams } from "react-router-dom";

const typeStyles: Record<string, {
  primary: string;
  bg: string;
  border: string;
  hoverBorder: string;
  iconBg: string;
  iconColor: string;
  dotBg: string;
  chevron: string;
}> = {
  "add-product": {
    primary: "#059669", // emerald-600
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    hoverBorder: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-100",
    iconColor: "#059669",
    dotBg: "bg-emerald-600",
    chevron: "text-emerald-600",
  },
  "delete-product": {
    primary: "#DC2626", // red-500
    bg: "bg-red-50/50",
    border: "border-red-200",
    hoverBorder: "hover:border-red-500/40",
    iconBg: "bg-red-100",
    iconColor: "#DC2626",
    dotBg: "bg-red-500",
    chevron: "text-red-500",
  },
  "price-increase": {
    primary: "#d97706", // amber-600
    bg: "bg-amber-50/50",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-500/40",
    iconBg: "bg-amber-100",
    iconColor: "#d97706",
    dotBg: "bg-amber-600",
    chevron: "text-amber-600",
  },
  "price-decrease": {
    primary: "#0891B2", // cyan-600
    bg: "bg-cyan-50/50",
    border: "border-cyan-200",
    hoverBorder: "hover:border-cyan-500/40",
    iconBg: "bg-cyan-100",
    iconColor: "#0891B2",
    dotBg: "bg-cyan-600",
    chevron: "text-cyan-600",
  },
  "description-change": {
    primary: "#2563EB", // blue-600
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    hoverBorder: "hover:border-blue-500/40",
    iconBg: "bg-blue-100",
    iconColor: "#2563EB",
    dotBg: "bg-blue-600",
    chevron: "text-blue-600",
  },
};

const iconMap: Record<string, React.ComponentType<any>> = {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  FileEdit,
};

export const DocumentTypeCard = ({
  config,
  isSelected,
  onSelect,
  count,
  variant = 'grid'
}: DocumentTypeCardProps & { variant?: 'grid' | 'horizontal' }) => {
  const IconComponent = iconMap[config.icon] || FileEdit;

  const styles = typeStyles[config.id]

  if (variant === 'horizontal') {
    return (
      <div
        onClick={onSelect}
        className={`
          group cursor-pointer transition-all duration-300
          px-6 py-4 rounded-2xl relative overflow-hidden flex items-center gap-4 shrink-0
          ${isSelected
            ? `bg-white shadow-md border ${styles.border} scale-[1.02]`
            : `bg-white backdrop-blur-sm shadow-sm  border-slate-200 hover:shadow-md ${styles.hoverBorder} hover:scale-[1.01]`
          }
        `}
      >
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            transition-all duration-300
            ${isSelected
              ? `${styles.iconBg} shadow-lg shadow-black/10`
              : `bg-slate-100 group-hover:${styles.bg}`
            }
          `}
          
        >
          <IconComponent
            className={`w-5 h-5 transition-all duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"
              }`}
            style={{ color: styles.iconColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight truncate">
            {config.name}
          </h3>
          {count !== undefined && (
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 animate-in fade-in slide-in-from-left-1 duration-500">
              {count} {count === 1 ? 'modification' : 'modifications'}
            </p>
          )}
        </div>
        {isSelected && (
          <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${styles.dotBg} animate-pulse`} />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`
        group cursor-pointer transition-all duration-300
        p-8 rounded-3xl relative overflow-hidden
        ${isSelected
          ? `bg-white shadow-xl border-2 ${styles.border} scale-[1.02]`
          : `bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200 hover:shadow-lg ${styles.hoverBorder} hover:scale-[1.01]`
        }
      `}
    >
      {/* Gradient overlay for selected state */}
      {isSelected && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ background: `linear-gradient(135deg, ${styles.primary} 0%, transparent 100%)` }}
        />
      )}

      <div className="flex items-start gap-6 relative z-10">
        <div
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center shrink-0
            transition-all duration-300
            ${isSelected
              ? 'shadow-lg shadow-black/10'
              : `bg-slate-50 border border-slate-200 group-hover:${styles.bg} group-hover:border-black/5`
            }
          `}
          style={isSelected ? { backgroundColor: styles.iconColor } : {}}
        >
          <IconComponent
            className={`w-6 h-6 transition-all duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"
              }`}
            style={{ color: "#ffffff" }}
            strokeWidth={2.5}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                {config.name}
              </h3>
              {count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles.bg} ${styles.chevron} border ${styles.border} animate-in zoom-in duration-500`}>
                  {count}
                </span>
              )}
            </div>
            <ChevronRight
              className={`w-5 h-5 transition-all duration-300 shrink-0 ${isSelected
                ? `${styles.chevron} translate-x-1`
                : `text-slate-300 group-hover:${styles.chevron} group-hover:translate-x-1`
                }`}
            />
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${styles.dotBg} animate-pulse`} />
      )}
    </div>
  );
};

export const DocumentTypeSelector = () => {
  const { selectedDocumentType, loadDocumentConfig, setCurrentStep } =
    useDocument();
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("job_id");
  const jobId = jobIdParam ? Number(jobIdParam) : undefined;

  const handleSelect = (configId: string) => {
    loadDocumentConfig(configId, jobId);
    setTimeout(() => {
      setCurrentStep("form-entry");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-cyan-50/30 to-slate-100 p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Select Document Type
          </h1>
          <p className="text-slate-500 font-medium">
            Choose the type of modification document you need to generate
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentConfigs.map((config, index) => (
            <div
              key={config.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <DocumentTypeCard
                config={config}
                isSelected={selectedDocumentType === config.id}
                onSelect={() => handleSelect(config.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};