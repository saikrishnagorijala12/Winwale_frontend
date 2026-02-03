import React, { useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  FileText, 
  CheckCircle2 
} from "lucide-react";
import { useDocument } from "@/src/context/DocumentContext";

export default function DocumentFormRenderer() {
  const {
    documentConfig,
    validateForm,
    setCurrentStep,
    validationErrors,
  } = useDocument();

  // Unified color palette from your Dashboard
  const colors = {
    bg: "#f5f7f9",
    fg: "#1b2531",
    primary: "#24548f",
    muted: "#627383",
    border: "#d9e0e8",
    success: "#33b17d",
    warning: "#f9ab20",
    destructive: "#df3a3a",
    secondaryBg: "#f8fafc"
  };

  const inputStyles = `
    w-full mt-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium
    focus:outline-none focus:ring-4 focus:ring-[#24548f]/5 focus:border-[#24548f]
    placeholder:text-slate-400
  `;

  const disabledInputStyles = `
    w-full mt-2 px-4 py-3 rounded-xl border bg-[#f8fafc] text-[#627383] 
    cursor-not-allowed border-[#d9e0e8] font-medium text-sm
  `;

  const fieldsBySection = useMemo(() => {
    if (!documentConfig) return {};
    return documentConfig.fields.reduce((acc, field) => {
      const section = field.section || "General Information";
      if (!acc[section]) acc[section] = [];
      acc[section].push(field);
      return acc;
    }, {});
  }, [documentConfig]);

  const handleProceedToValidation = () => {
    const isValid = validateForm();
    // if (!isValid) return;
    setCurrentStep("preview");
  };

  const handleBack = () => {
    setCurrentStep("select-type");
  };

  if (!documentConfig) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-slate-500 font-bold">
        Please select a document type first.
      </div>
    );
  }

  const getInputType = (type) => {
    switch (type) {
      case "number": case "email": case "password": case "date": return type;
      default: return "text";
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 animate-fade-in" style={{ backgroundColor: colors.bg }}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 rounded-lg bg-white shadow-sm border" style={{borderColor: colors.border}}>
                <FileText className="w-5 h-5" style={{color: colors.primary}} />
             </div>
             <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: colors.fg }}>
                {documentConfig.name}
             </h1>
          </div>
          <p className="font-medium" style={{ color: colors.muted }}>
            Complete the required fields. Locked fields are system-generated.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border bg-white text-sm font-bold transition-all hover:bg-gray-50 active:scale-95"
                style={{ color: colors.fg, borderColor: colors.border }}
            >
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>
        </div>
      </div>

      {/* Error State Alert */}
      {validationErrors.length > 0 && (
        <div 
          className="flex items-center gap-4 p-4 mb-8 rounded-2xl border animate-slide-up" 
          style={{ backgroundColor: `${colors.destructive}0D`, borderColor: `${colors.destructive}40` }}
        >
          <div className="p-2 rounded-xl bg-white shadow-sm">
            <AlertTriangle className="w-5 h-5" style={{ color: colors.destructive }} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider" style={{ color: colors.destructive }}>
              Validation Required
            </p>
            <p className="text-sm font-bold" style={{ color: colors.fg }}>
              Please correct the highlighted fields below to proceed.
            </p>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-8 animate-slide-up">
        {Object.entries(fieldsBySection).map(([section, fields]) => (
          <div key={section} className="bg-white rounded-2xl shadow-sm border border-transparent overflow-hidden">
            <div className="px-8 py-6 border-b" style={{ borderColor: colors.secondaryBg }}>
              <h3 className="text-xl font-extrabold uppercase tracking-tight" style={{ color: colors.fg }}>
                {section}
              </h3>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {fields.map((field) => {
                const isReadOnly = field.behavior === "readonly";
                const hasError = validationErrors.some((err) => err.fieldId === field.id);

                return (
                  <div key={field.id} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <label className="text-[11px] font-black uppercase tracking-widest ml-1" style={{ color: colors.muted }}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        disabled={isReadOnly}
                        placeholder={field.placeholder}
                        className={`${isReadOnly ? disabledInputStyles : inputStyles} min-h-[120px] resize-none`}
                        style={{ 
                            borderColor: hasError ? colors.destructive : colors.border,
                            backgroundColor: isReadOnly ? colors.secondaryBg : 'white'
                        }}
                      />
                    ) : (
                      <input
                        type={getInputType(field.type)}
                        disabled={isReadOnly}
                        placeholder={field.placeholder}
                        className={isReadOnly ? disabledInputStyles : inputStyles}
                        style={{ 
                            borderColor: hasError ? colors.destructive : colors.border,
                            backgroundColor: isReadOnly ? colors.secondaryBg : 'white'
                        }}
                      />
                    )}
                    {hasError && (
                        <p className="text-[10px] font-bold mt-1.5 ml-1" style={{color: colors.destructive}}>
                            This field is required
                        </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-10 flex items-center justify-end gap-4 animate-slide-up pb-10">
        <button
          onClick={handleProceedToValidation}
          className="btn-primary"
        >
          Validate & Continue
          <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}