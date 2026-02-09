import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useDocument } from "@/src/context/DocumentContext";

interface FieldOption {
  value: string;
  label: string;
}

interface DocumentField {
  id: string;
  label: string;
  type: string;
  section?: string;
  required?: boolean;
  placeholder?: string;
  behavior?: string;
  width?: string;
  options?: Array<{ value: string; label: string }>;
}

export default function DocumentFormRenderer() {
  const {
    documentConfig,
    formData,
    updateField,
    validateForm,
    setCurrentStep,
    validationErrors,
  } = useDocument();

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("");

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
    if (!documentConfig?.fields) return {} as Record<string, DocumentField[]>;
    
    return documentConfig.fields.reduce((acc, field: DocumentField) => {
      const section = field.section || "General Information";
      if (!acc[section]) acc[section] = [];
      acc[section].push(field);
      return acc;
    }, {} as Record<string, DocumentField[]>);
  }, [documentConfig]);

  const sections = useMemo(() => Object.keys(fieldsBySection), [fieldsBySection]);

  useEffect(() => {
    if (sections.length > 0 && !activeTab) {
      setActiveTab(sections[0]);
    }
  }, [sections, activeTab]);

  const handleProceedToValidation = () => {
    const isValid = validateForm();
    if (isValid) {
      setCurrentStep("preview");
    }
  };

  // Helper to check if a specific section has errors
  const sectionHasErrors = (sectionName: string) => {
    const sectionFieldIds = fieldsBySection[sectionName]?.map(f => f.id) || [];
    return validationErrors.some(err => sectionFieldIds.includes(err.fieldId));
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

  const activeIndex = sections.indexOf(activeTab);

  return (
    <div className="animate-fade-in  mx-auto">
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
        {sections.map((section) => {
          const isActive = activeTab === section;
          const hasErrors = sectionHasErrors(section);
          
          return (
            <button
              key={section}
              onClick={() => setActiveTab(section)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 relative ${
                isActive 
                  ? "border-[#24548f] text-[#24548f]" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {section}
              {hasErrors && (
                <span className="absolute top-3 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] animate-slide-up">
        <div className="p-8 flex flex-wrap -mx-4 gap-y-6">
          {fieldsBySection[activeTab]?.map((field) => {
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
                      <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
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
                  <div className="flex items-center gap-1 mt-1.5 ml-1 text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <p className="text-[10px] font-bold">This field is required</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex items-center justify-between pb-10">
        <button
          onClick={() => activeIndex > 0 ? setActiveTab(sections[activeIndex - 1]) : setCurrentStep("select-type")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {activeIndex === 0 ? "Back" : "Previous Section"}
        </button>

        {activeIndex === sections.length - 1 ? (
          <button
            onClick={handleProceedToValidation}
            className="flex items-center gap-2 px-8 py-3 bg-[#24548f] text-white rounded-xl font-bold text-sm hover:bg-[#1a3e6b] transition-all shadow-lg shadow-blue-900/10"
          >
            Review & Continue
            <ChevronRight className="w-4 h-4" strokeWidth={3} />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab(sections[activeIndex + 1])}
            className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-[#24548f] rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Next Section
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}