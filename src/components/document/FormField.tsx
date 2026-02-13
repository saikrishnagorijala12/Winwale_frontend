import { Lock, Edit3, AlertCircle } from "lucide-react";
import { useDocument } from "@/src/context/DocumentContext";
import { DocumentField } from "@/src/types/document.types";

interface FormFieldProps {
  field: DocumentField;
}

export const FormField = ({ field }: FormFieldProps) => {
  const { formData, updateField, validationErrors } = useDocument();

  const value = formData[field.id] ?? "";
  const error = validationErrors.find((e) => e.fieldId === field.id);

  const isReadonly = field.behavior === "readonly";
  const isManual = field.behavior === "manual";

  const getBehaviorClass = () => {
    if (isReadonly) return "field-readonly";
    if (isManual) return "field-manual";
    return "field-editable";
  };

  const baseClassName = `
    w-full rounded border px-3 py-2
    ${getBehaviorClass()}
    ${error ? "border-red-500" : ""}
  `;

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.id}
            value={String(value)}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={isReadonly}
            className={`${baseClassName} min-h-25`}
          />
        );

      case "select":
        return (
          <select
            id={field.id}
            value={String(value)}
            onChange={(e) => updateField(field.id, e.target.value)}
            disabled={isReadonly}
            className={baseClassName}
          >
            <option value="" disabled>
              {field.placeholder || "Select..."}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            id={field.id}
            type="date"
            value={String(value)}
            onChange={(e) => updateField(field.id, e.target.value)}
            disabled={isReadonly}
            className={baseClassName}
          />
        );

      case "number":
      case "percentage":
      case "currency":
        return (
          <div className="relative">
            {field.type === "currency" && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
            )}

            <input
              id={field.id}
              type="number"
              value={String(value)}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              disabled={isReadonly}
              className={`${baseClassName} ${
                field.type === "currency" ? "pl-7" : ""
              }`}
            />

            {field.type === "percentage" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            )}
          </div>
        );

      default:
        return (
          <input
            id={field.id}
            type={
              field.type === "email"
                ? "email"
                : field.type === "phone"
                ? "tel"
                : "text"
            }
            value={String(value)}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={isReadonly}
            className={baseClassName}
          />
        );
    }
  };

  return (
    <div className="space-y-2 animate-slide-in">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={field.id}
          className="text-sm font-medium flex items-center gap-2"
        >
          {field.label}
          {field.validation?.some((v) => v.type === "required") && (
            <span className="text-red-600">*</span>
          )}
        </label>

        <div className="flex items-center gap-1.5 text-xs">
          {isReadonly && <Lock className="w-4 h-4 text-muted-foreground" />}
          {isManual && <Edit3 className="w-4 h-4 text-primary" />}
        </div>
      </div>

      {renderInput()}

      {error && (
        <div className="flex items-center gap-1.5 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </div>
      )}
    </div>
  );
};
