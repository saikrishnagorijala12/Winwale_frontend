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
import * as validators from "../utils/validators";

const fetchJobDetails = async (jobId: number) => {
  const response = await api.get(`/generate/${jobId}`);
  return response.data;
};

const mapJobDetailsToForm = (api: any) => {
  const client = api.client || {};
  const contract = api.client_contract || {};
  const modificationSummary = api.modification_summary || {};

  const discounts = contract.discounts || {};
  const delivery = contract.delivery || {};
  const address = contract.address || {};
  const other = contract.other || {};
  const negotiator = api.negotiator || {};

  return {
    companyName: client.company_name,
    companyLogo: client.logo,
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
      `${address.contract_officer_city || ""}, ${address.contract_officer_state || ""}, ${address.contract_officer_zip || ""}`.trim(),
    negotiatorName: negotiator.name,
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
    priceIncreased: modificationSummary.price_increased,
    priceDecreased: modificationSummary.price_decreased,
    requestedIncrease: modificationSummary.price_increased > 0 ? "" : undefined,
    requestedDecrease: modificationSummary.price_decreased > 0 ? "" : undefined,

    totalSins: api.total_sins,
    ...(() => {
      const getFormatted = (actionKey: string, fallbackGroups: any) => {
        const actionSins = api.sin_groups_by_action?.[actionKey];
        if (Array.isArray(actionSins)) return actionSins.join(", ");

        if (Array.isArray(fallbackGroups)) return fallbackGroups.join(", ");
        if (fallbackGroups && typeof fallbackGroups === "object")
          return Object.keys(fallbackGroups).join(", ");
        return "";
      };

      const legacyGroups = api.sin_groups;

      return {
        sinsFormatted: getFormatted("ALL", legacyGroups),
        sin_additions: getFormatted("ADDED_PRODUCT", legacyGroups),
        sin_deletions: getFormatted("REMOVED_PRODUCT", legacyGroups),
        sin_price_increase: getFormatted("PRICE_INCREASE", legacyGroups),
        sin_price_decrease: getFormatted("PRICE_DECREASE", legacyGroups),
        sin_description_change: getFormatted("DESCRIPTION_CHANGE", legacyGroups),
      };
    })(),
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
  const [cachedJobDetails, setCachedJobDetails] = useState<any | null>(null);
  const [loadedJobId, setLoadedJobId] = useState<number | null>(null);

  const loadDocumentConfig = useCallback(
    async (typeId: string, jobId?: number) => {
      const config = getDocumentConfig(typeId);
      if (!config) return;

      setDocumentConfig(config);
      setSelectedDocumentType(typeId);

      try {
        let mappedData: Record<string, any> = {};

        let jobDetails = null;

        if (jobId) {
          if (jobId === loadedJobId && cachedJobDetails) {
            jobDetails = cachedJobDetails;
          } else {
            setCurrentStep("load-config");
            jobDetails = await fetchJobDetails(jobId);
            setCachedJobDetails(jobDetails);
            setLoadedJobId(jobId);
          }
        }

        if (jobDetails) {
          mappedData = mapJobDetailsToForm(jobDetails);
          setAnalysisSummary(jobDetails.modification_summary);
        }

        if (user) {
          mappedData.consultantName = user.name;
          mappedData.consultantEmail = user.email;
          mappedData.consultantPhone = user.phone_no;
        }

        const newValues: Record<string, string | number> = {};
        config.fields.forEach((field) => {
          if (mappedData[field.id] !== undefined) {
            newValues[field.id] = mappedData[field.id];
          } else if (field.defaultValue !== undefined) {
            newValues[field.id] = field.defaultValue;
          }
        });

        setFormData((prev) => {
          const merged = { ...prev };
          Object.keys(newValues).forEach((key) => {
            const isCountField =
              key.toLowerCase().includes("numberof") ||
              key.toLowerCase().includes("priceincreased") ||
              key.toLowerCase().includes("pricedecreased") ||
              key.toLowerCase().includes("descriptionchanged");
            if (isCountField || prev[key] === undefined || prev[key] === "") {
              merged[key] = newValues[key];
            }
          });

          if (mappedData.companyLogo) {
            merged.companyLogo = mappedData.companyLogo;
          }

          return merged;
        });

        setCurrentStep("form-entry");
      } catch (error) {
        console.error("Prefill failed:", error);
      }
    },
    [user, loadedJobId, cachedJobDetails, setCurrentStep],
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
      const fieldValue = typeof value === "string" ? value.trim() : value;
      const fieldLabel = field.label;

      const hasRequiredRule = field.validation?.some(
        (rule) => rule.type === "required",
      );

      if (hasRequiredRule) {
        if (
          !fieldValue &&
          fieldValue !== 0 &&
          (typeof fieldValue !== "string" || fieldValue.trim() === "")
        ) {
          errors.push({
            fieldId: field.id,
            message: `${fieldLabel} is required`,
          });
          return;
        }
      }

      if (!fieldValue && fieldValue !== 0) {
        return;
      }

      let errorMessage: string | null = null;

      if (field.type === "email") {
        errorMessage = validators.validateEmail(String(fieldValue));
      } else if (
        field.id.toLowerCase().includes("phone") ||
        field.id.toLowerCase().includes("phoneno")
      ) {
        errorMessage = validators.validatePhone(String(fieldValue), fieldLabel);
      } else if (
        field.id.toLowerCase().includes("name") &&
        !field.id.toLowerCase().includes("company")
      ) {
        errorMessage = validators.validateName(String(fieldValue));
      } else if (
        field.id.toLowerCase().includes("zip") ||
        field.id.toLowerCase().includes("postal")
      ) {
        errorMessage = validators.validateZip(String(fieldValue));
      } else if (field.type === "number" || field.type === "percentage") {
        const numValue = Number(fieldValue);
        if (isNaN(numValue)) {
          errorMessage = `${fieldLabel} must be a valid number`;
        } else if (numValue < 0) {
          errorMessage = `${fieldLabel} must be a positive number`;
        }
      }

      if (errorMessage) {
        errors.push({
          fieldId: field.id,
          message: errorMessage,
        });
      }
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
    setCachedJobDetails(null);
    setLoadedJobId(null);
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
  }, [documentConfig, documentHistory, formData, selectedDocumentType, user]);

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
