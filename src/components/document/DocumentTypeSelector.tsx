import { Plus, Trash2, TrendingUp, TrendingDown, FileEdit, ChevronRight } from "lucide-react";
import { useDocument } from "@/src/context/DocumentContext";
import { DocumentTypeCardProps } from "@/src/types/document.types";
import { documentConfigs } from "@/src/types/documentConfigs";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  FileEdit,
};

const DocumentTypeCard = ({
  config,
  isSelected,
  onSelect,
}: DocumentTypeCardProps) => {
  const IconComponent = iconMap[config.icon] || FileEdit;
  
  return (
    <div
      onClick={onSelect}
      className={`
        group cursor-pointer transition-all duration-300
        p-8 rounded-[24px] relative overflow-hidden
        ${
          isSelected
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
            ${
              isSelected
                ? "bg-[#24548f] shadow-lg shadow-[#24548f]/25"
                : "bg-slate-50 border border-slate-200 group-hover:bg-[#24548f]/10 group-hover:border-[#24548f]/30"
            }
          `}
        >
          <IconComponent
            className={`w-6 h-6 transition-all duration-300 ${
              isSelected ? "scale-110" : "group-hover:scale-110"
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
              className={`w-5 h-5 transition-all duration-300 shrink-0 ${
                isSelected
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

  const handleSelect = (configId: string) => {
    loadDocumentConfig(configId);
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

        {/* Helper Text */}
        {selectedDocumentType && (
          <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <p className="text-sm text-blue-900 font-medium text-center">
              Click continue or wait to proceed with your selection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Add these animations to your global CSS file
/*
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
  opacity: 0;
}
*/