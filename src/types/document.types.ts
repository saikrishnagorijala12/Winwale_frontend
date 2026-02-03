
import { jsPDF } from "jspdf";
import { Paragraph } from "docx";
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "email"
  | "phone"
  | "percentage"
  | "currency"
  | "textarea"
  | "select";

export type FieldBehavior = "readonly" | "editable" | "manual";

export interface ValidationRule {
  type:
    | "required"
    | "email"
    | "phone"
    | "minLength"
    | "maxLength"
    | "min"
    | "max"
    | "pattern"
    | "date";
  value?: string | number;
  message: string;
}

export interface DocumentTypeCardProps {
  config: DocumentConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export interface DocumentField {
  id: string;
  label: string;
  type: FieldType;
  behavior: FieldBehavior;
  section: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: ValidationRule[];
  defaultValue?: string | number;
}

export interface DocumentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: DocumentField[];
}

export interface DocumentMetadata {
  id: string;
  documentType: string;
  version: string;
  generatedBy: string;
  generatedAt: string;
  data: Record<string, string | number>;
}

export type WorkflowStep =
  | "select-type"
  | "load-config"
  | "form-entry"
  | "validation"
  | "preview"
  | "generate";

export type DocumentTemplateType =
  | "addition"
  | "deletion"
  | "price-increase"
  | "price-decrease"
  | "description-change";

export const resolveTemplateType = (documentId: string) => {
  switch (documentId) {
    case "addition":
    case "add-product":
    case "add-product-modification":
      return "addition";

    case "deletion":
    case "delete-product":
      return "deletion";

    case "price-increase":
      return "price-increase";

    case "price-decrease":
      return "price-decrease";

    case "description-change":
      return "description-change";

    default:
      console.error("No template mapped for documentId:", documentId);
      return null;
  }
};

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface DocumentContextType {
  currentStep: WorkflowStep;
  setCurrentStep: (step: WorkflowStep) => void;

  selectedDocumentType: string | null;
  setSelectedDocumentType: (type: string | null) => void;
  documentConfig: DocumentConfig | null;

  formData: Record<string, string | number>;
  setFormData: React.Dispatch<
    React.SetStateAction<Record<string, string | number>>
  >;
  updateField: (fieldId: string, value: string | number) => void;

  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
  validateForm: () => boolean;

  documentHistory: DocumentMetadata[];
  addToHistory: (doc: DocumentMetadata) => void;

  loadDocumentConfig: (typeId: string) => Promise<void>;
  resetWorkflow: () => void;
  generateDocument: () => DocumentMetadata;
}

export interface Step {
  id: WorkflowStep;
  label: string;
  description: string;
}


export interface DocumentTemplate {
  id: string;
  name: string;
  renderPreview: (data: any) => JSX.Element;
  renderPDF: (pdf: jsPDF, data: any) => void;
  renderDOCX: (data: any) => Paragraph[];
}
