import React, { createContext, useContext, useState, useCallback } from "react";
import {
  DocumentContextType,
  DocumentConfig,
  DocumentMetadata,
  ValidationError,
  WorkflowStep,
} from "../types/document.types";
import { getDocumentConfig } from "../types/documentConfigs";

const API_BASE = "http://localhost:5000";

const fetchClientProfile = async () => {
  const res = await fetch(`${API_BASE}/clients`);
  if (!res.ok) throw new Error("Failed to fetch client profile");
  return res.json();
};

const mapClientProfileToForm = (api: any) => ({
  contractNumber: api.contract_number,
  contractorName: api.contracting_officer_name,
  contractorAddress: api.contracting_officer_address,

  companyName: api.company_name,
  companyLogoUrl: api.company_logo_url,

  coo: api.coo,

  quantityVolumeDiscount: api.quantity_volume_discount,
  otherDiscounts: api.additional_concessions,
  basicDiscount: api.basicdiscount,

  deliveryAroNormal: api.delivery_time_normal,
  deliveryAroExpedited: api.delivery_time_expedited,

  fobTerms: api.fob_term,

  energyStarCompliance: (() => {
    const value = api.energy_star_compliance?.toLowerCase();

    if (value === "yes") return "yes";
    if (value === "no") return "no";
    if (value === "applicable" || value === "not applicable" || value === "n/a")
      return "na";

    return "";
  })(),
  energyCompliance: api.energy_compliance,

  refresh: api.refresh_number,

  consultantName: api.consultant_name,
  consultantEmail: api.consultant_email,
  consultantPhone: api.consultant_phone,

  placeOfPerformance: api.place_of_performance,
  solicitationNumber: api.gsa_mas_solicitation_number,

  salutationName: api.salutation_name,
  signatoryName: api.signatory_name,
  signatoryTitle: api.signatory_title,
});

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("select-type");
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    string | null
  >(null);
  const [documentConfig, setDocumentConfig] = useState<DocumentConfig | null>(
    null
  );
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [documentHistory, setDocumentHistory] = useState<DocumentMetadata[]>(
    []
  );

  const loadDocumentConfig = useCallback(async (typeId: string) => {
    const config = getDocumentConfig(typeId);
    if (!config) return;

    setDocumentConfig(config);
    setSelectedDocumentType(typeId);
    setCurrentStep("load-config");

    try {
      const clientProfile = await fetchClientProfile();
      const mappedData = mapClientProfileToForm(clientProfile);

      const initialData: Record<string, string | number> = {};

      config.fields.forEach((field) => {
        if (mappedData[field.id] !== undefined) {
          initialData[field.id] = mappedData[field.id];
        } else if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });

      setFormData(initialData);
    } catch (error) {
      console.error("Prefill failed:", error);
      setFormData({});
    }
  }, []);

  const updateField = useCallback((fieldId: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setValidationErrors((prev) => prev.filter((e) => e.fieldId !== fieldId));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!documentConfig) return false;

    const errors: ValidationError[] = [];

    documentConfig.fields.forEach((field) => {
      const value = formData[field.id];

      field.validation?.forEach((rule) => {
        switch (rule.type) {
          case "required":
            if (!value || (typeof value === "string" && value.trim() === "")) {
              errors.push({
                fieldId: field.id,
                message: rule.message,
              });
            }
            break;
          case "email":
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
              errors.push({
                fieldId: field.id,
                message: rule.message,
              });
            }
            break;
          case "phone":
            if (value && !/^[\d\s\-\(\)\+]+$/.test(String(value))) {
              errors.push({
                fieldId: field.id,
                message: rule.message,
              });
            }
            break;
        }
      });
    });

    setValidationErrors(errors);
    return errors.length === 0;
  }, [documentConfig, formData]);

  const resetWorkflow = useCallback(() => {
    setCurrentStep("select-type");
    setSelectedDocumentType(null);
    setDocumentConfig(null);
    setFormData({});
    setValidationErrors([]);
  }, []);

  const generateDocument = useCallback((): DocumentMetadata => {
    const docId = `DOC-${Date.now().toString(36).toUpperCase()}`;
    const versionCount = documentHistory.filter(
      (d) => d.documentType === selectedDocumentType
    ).length;

    return {
      id: docId,
      documentType: documentConfig?.name || "",
      version: `v1.${versionCount}`,
      generatedBy: "Michael J. Thompson",
      generatedAt: new Date().toISOString(),
      data: { ...formData },
    };
  }, [documentConfig, documentHistory, formData, selectedDocumentType]);

  const addToHistory = useCallback((doc: DocumentMetadata) => {
    setDocumentHistory((prev) => [doc, ...prev]);
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        selectedDocumentType,
        setSelectedDocumentType,
        documentConfig,
        formData,
        setFormData,
        updateField,
        validationErrors,
        setValidationErrors,
        validateForm,
        documentHistory,
        addToHistory,
        loadDocumentConfig,
        resetWorkflow,
        generateDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
};
