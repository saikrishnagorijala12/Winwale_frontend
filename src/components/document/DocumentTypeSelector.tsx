import { Plus, Trash2, TrendingUp, TrendingDown, FileEdit, ChevronRight } from "lucide-react";
import { useDocument } from "@/src/context/DocumentContext";
import { DocumentTypeCardProps } from "@/src/types/document.types";
import { documentConfigs } from "@/src/types/documentConfigs";
import { useSearchParams } from "react-router-dom";

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
  variant = 'grid'
}: DocumentTypeCardProps & { variant?: 'grid' | 'horizontal' }) => {
  const IconComponent = iconMap[config.icon] || FileEdit;

  if (variant === 'horizontal') {
    return (
      <div
        onClick={onSelect}
        className={`
          group cursor-pointer transition-all duration-300
          px-6 py-4 rounded-2xl relative overflow-hidden flex items-center gap-4 shrink-0
          ${isSelected
            ? "bg-white shadow-md border-2 border-[#24548f] scale-[1.02]"
            : "bg-white/50 backdrop-blur-sm shadow-sm border border-slate-200 hover:shadow-md hover:border-[#24548f]/40 hover:scale-[1.01]"
          }
        `}
      >
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            transition-all duration-300
            ${isSelected
              ? "bg-[#24548f] shadow-lg shadow-[#24548f]/25"
              : "bg-slate-50 border border-slate-200 group-hover:bg-[#24548f]/10"
            }
          `}
        >
          <IconComponent
            className={`w-5 h-5 transition-all duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"
              }`}
            style={{ color: isSelected ? "#ffffff" : "#24548f" }}
            strokeWidth={2.5}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight truncate">
            {config.name}
          </h3>
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#24548f] animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`
        group cursor-pointer transition-all duration-300
        p-8 rounded-[24px] relative overflow-hidden
        ${isSelected
          ? "bg-white shadow-xl border-2 border-[#24548f] scale-[1.02]"
          : "bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200 hover:shadow-lg hover:border-[#24548f]/40 hover:scale-[1.01]"
        }
      `}
    >
      {/* Gradient overlay for selected state */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#24548f]/5 via-transparent to-transparent pointer-events-none" />
      )}

      <div className="flex items-start gap-6 relative z-10">
        <div
          className={`
            w-14 h-14 rounded-2xl flex items-center justify-center shrink-0
            transition-all duration-300
            ${isSelected
              ? "bg-[#24548f] shadow-lg shadow-[#24548f]/25"
              : "bg-slate-50 border border-slate-200 group-hover:bg-[#24548f]/10 group-hover:border-[#24548f]/30"
            }
          `}
        >
          <IconComponent
            className={`w-6 h-6 transition-all duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"
              }`}
            style={{ color: isSelected ? "#ffffff" : "#24548f" }}
            strokeWidth={2.5}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">
              {config.name}
            </h3>
            <ChevronRight
              className={`w-5 h-5 transition-all duration-300 shrink-0 ${isSelected
                ? "text-[#24548f] translate-x-1"
                : "text-slate-300 group-hover:text-[#24548f] group-hover:translate-x-1"
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
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#24548f] animate-pulse" />
      )}
    </div>
  );
};

export const DocumentTypeSelector = () => {
  const { selectedDocumentType, loadDocumentConfig, setCurrentStep } =
    useDocument();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job_id");

  const handleSelect = (configId: string) => {
    loadDocumentConfig(configId, jobId || undefined);
    setTimeout(() => {
      setCurrentStep("form-entry");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 lg:p-10">
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