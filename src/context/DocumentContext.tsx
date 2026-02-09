import React, { createContext, useContext, useState, useCallback } from "react";
import {
  DocumentContextType,
  DocumentConfig,
  DocumentMetadata,
  ValidationError,
  WorkflowStep,
} from "../types/document.types";
import { getDocumentConfig } from "../types/documentConfigs";
import api from "../lib/axios";
import { useAuth } from "./AuthContext";

const fetchJobDetails = async (jobId: string) => {
  const response = await api.get(`/generate/${jobId}`);
  return response.data;
};

const mapJobDetailsToForm = (api: any) => {
  const client = api.client || {};
  const contract = api.client_contract || {};
  const modificationSummary = api.modification_summary || {};

  const discounts = contract.discounts || {};
  const delivery = contract.delivery || {};
  const address = contract.address || contract.addres || {};
  const other = contract.other || {};

  return {
    companyName: client.company_name,
    contractNumber: contract.contract_number,

    contractorName: contract.contract_officer_name,
    contractorAddress: address.contract_officer_address,
    contractorCity: address.contract_officer_city,
    contractorState: address.contract_officer_state,
    contractorZip: address.contract_officer_zip,

    gsaOfficeAddressLine: address.contract_officer_address,
    gsaOfficeCity: address.contract_officer_city,
    gsaOfficeState: address.contract_officer_state,
    gsaOfficeZip: address.contract_officer_zip,
    gsaOfficeCityStateZip:
      `${address.contract_officer_city || ""}, ${address.contract_officer_state || ""} ${address.contract_officer_zip || ""}`.trim(),

    deliveryAroNormal: delivery.normal_delivery_time,
    deliveryAroExpedited: delivery.expedited_delivery_time,

    fobTerms: other.fob_term,

    coo: contract.origin_country,
    basicDiscount: discounts.gsa_proposed_discount,
    quantityVolumeDiscount: discounts.q_v_discount,
    otherDiscounts: other.additional_concessions,

    energyStarCompliance: (() => {
      const value = other.energy_star_compliance?.toLowerCase();
      if (value === "yes") return "yes";
      if (value === "no") return "no";
      if (
        value === "applicable" ||
        value === "not applicable" ||
        value === "n/a"
      )
        return "na";
      return "";
    })(),

    numberOfProductsAdded: modificationSummary.products_added,
    numberOfProductsDeleted: modificationSummary.products_deleted,
    descriptionChanged: modificationSummary.description_changed,
    numberOfItemsChanged: modificationSummary.description_changed,
    requestedIncrease: modificationSummary.price_increased > 0 ? "" : undefined,
    requestedDecrease: modificationSummary.price_decreased > 0 ? "" : undefined,
  };
};

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined,
);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("select-type");
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    string | null
  >(null);
  const [documentConfig, setDocumentConfig] = useState<DocumentConfig | null>(
    null,
  );
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [documentHistory, setDocumentHistory] = useState<DocumentMetadata[]>(
    [],
  );
  const [analysisSummary, setAnalysisSummary] = useState<any | null>(null);

  const loadDocumentConfig = useCallback(
    async (typeId: string, jobId?: string) => {
      const config = getDocumentConfig(typeId);
      if (!config) return;

      setDocumentConfig(config);
      setSelectedDocumentType(typeId);
      setCurrentStep("load-config");

      try {
        let mappedData: Record<string, any> = {};

        const jobDetails = jobId ? await fetchJobDetails(jobId) : null;

        if (jobDetails) {
          console.log("Received job details:", jobDetails);
          mappedData = mapJobDetailsToForm(jobDetails);
          setAnalysisSummary(jobDetails.modification_summary);
        }

        if (user) {
          mappedData.consultantName = user.name;
          mappedData.consultantEmail = user.email;
          mappedData.consultantPhone = user.phone_no;
        }

        const initialData: Record<string, string | number> = {};

        config.fields.forEach((field) => {
          if (mappedData[field.id] !== undefined) {
            initialData[field.id] = mappedData[field.id];
          } else if (field.defaultValue !== undefined) {
            initialData[field.id] = field.defaultValue;
          }
        });

        console.log("Final initialData to set:", initialData);
        setFormData(initialData);
      } catch (error) {
        console.error("Prefill failed:", error);
        setFormData({});
      }
    },
    [user],
  );

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
    setAnalysisSummary(null);
  }, []);

  const generateDocument = useCallback((): DocumentMetadata => {
    const docId = `DOC-${Date.now().toString(36).toUpperCase()}`;
    const versionCount = documentHistory.filter(
      (d) => d.documentType === selectedDocumentType,
    ).length;

    return {
      id: docId,
      documentType: documentConfig?.name || "",
      version: `v1.${versionCount}`,
      generatedBy: user?.name || "Unknown User",
      generatedAt: new Date().toISOString(),
      data: { ...formData },
    };
  }, [documentConfig, documentHistory, formData, selectedDocumentType,user]);

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
        analysisSummary,
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
