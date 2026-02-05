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
    formData,
    updateField,
    validateForm,
    setCurrentStep,
    validationErrors,
  } = useDocument();

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
    if (!documentConfig) return {} as Record<string, typeof documentConfig.fields>;
    return documentConfig.fields.reduce((acc, field) => {
      const section = field.section || "General Information";
      if (!acc[section]) acc[section] = [];
      acc[section].push(field);
      return acc;
    }, {} as Record<string, typeof documentConfig.fields>);
  }, [documentConfig]);

  const handleProceedToValidation = () => {
    const isValid = validateForm();
    if (!isValid) return;
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

  const getInputType = (type: string) => {
    switch (type) {
      case "number": case "email": case "password": case "date": return type;
      default: return "text";
    }
  };

  return (
    <div className="animate-fade-in">


      {/* Form Sections */}
      <div className="space-y-8 animate-slide-up">
        {Object.entries(fieldsBySection).map(([section, fields]) => (
          <div key={section} className="bg-white rounded-2xl shadow-sm border border-transparent overflow-hidden">
            <div className="px-8 py-6 border-b" style={{ borderColor: colors.secondaryBg }}>
              <h3 className="text-xl font-extrabold uppercase tracking-tight" style={{ color: colors.fg }}>
                {section}
              </h3>
            </div>

            <div className="p-8 flex flex-wrap -mx-4 gap-y-6">
              {fields.map((field) => {
                const isReadOnly = field.behavior === "readonly";
                const hasError = validationErrors.some((err) => err.fieldId === field.id);
                const widthClass = field.width || (field.type === "textarea" ? "w-full" : "w-full md:w-1/2");

                return (
                  <div key={field.id} className={`${widthClass} px-4`}>
                    <label className="text-[11px] font-black uppercase tracking-widest ml-1" style={{ color: colors.muted }}>
                      {field.required && <span className="text-red-500 mr-1">*</span>}
                      {field.label}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        value={formData[field.id] || ""}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        disabled={isReadOnly}
                        placeholder={field.placeholder}
                        className={`${isReadOnly ? disabledInputStyles : inputStyles} min-h-[120px] resize-none`}
                        style={{
                          borderColor: hasError ? colors.destructive : colors.border,
                          backgroundColor: isReadOnly ? colors.secondaryBg : 'white'
                        }}
                      />

                    ) : field.type === "select" ? (
                      <div className="relative">
                        <select
                          value={formData[field.id] || ""}
                          onChange={(e) => updateField(field.id, e.target.value)}
                          disabled={isReadOnly}
                          className={`${isReadOnly ? disabledInputStyles : inputStyles} appearance-none pr-8`}
                          style={{
                            borderColor: hasError ? colors.destructive : colors.border,
                            backgroundColor: isReadOnly ? colors.secondaryBg : 'white'
                          }}
                        >
                          <option value="" disabled>Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <input
                        type={getInputType(field.type)}
                        value={formData[field.id] || ""}
                        onChange={(e) => updateField(field.id, e.target.value)}
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
                      <p className="text-[10px] font-bold mt-1.5 ml-1" style={{ color: colors.destructive }}>
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