import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../types/client.types";

export const validateStep1 = (
  clientData: ClientFormData | EditingClient,
  setErrors: (errors: ClientFormErrors) => void,
): boolean => {
  const newErrors: ClientFormErrors = {};

  const required = [
    { field: "company_name", label: "Company Name" },
    { field: "company_email", label: "Company Email" },
    { field: "company_phone_no", label: "Company Phone" },
    { field: "company_address", label: "Company Address" },
    { field: "company_city", label: "City" },
    { field: "company_state", label: "State" },
    { field: "company_zip", label: "ZIP" },
  ] as const;

  required.forEach(({ field, label }) => {
    if (!clientData[field]?.trim()) {
      newErrors[field] = `${label} is required`;
    }
  });

  if (
    clientData.company_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.company_email)
  ) {
    newErrors.company_email = "Please enter a valid email address";
  }

  if (
    clientData.company_phone_no &&
    !/^\+?[0-9\s\-()]{7,}$/.test(clientData.company_phone_no)
  ) {
    newErrors.company_phone_no = "Please enter a valid phone number";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const validateStep2 = (
  clientData: ClientFormData | EditingClient,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const required = [
    { field: "contact_officer_name", label: "Primary contact name" },
    { field: "contact_officer_email", label: "Email address" },
    { field: "contact_officer_phone_no", label: "Phone number" },
  ] as const;

  required.forEach(({ field, label }) => {
    if (!clientData[field]?.trim()) {
      errors[field] = `${label} is required`;
    }
  });

  if (
    clientData.contact_officer_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.contact_officer_email)
  ) {
    errors.contact_officer_email = "Please enter a valid email address";
  }

  if (
    clientData.contact_officer_phone_no &&
    !/^\+?[0-9\s\-()]{7,}$/.test(clientData.contact_officer_phone_no)
  ) {
    errors.contact_officer_phone_no = "Please enter a valid phone number";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAllSteps = (
  clientData: ClientFormData | EditingClient,
  setErrors: (errors: ClientFormErrors) => void,
): boolean => {
  const step1Valid = validateStep1(clientData, setErrors);
  const step2Result = validateStep2(clientData);

  if (!step1Valid || !step2Result.isValid) {
    setErrors(step2Result.errors as ClientFormErrors);
    return false;
  }

  return true;
};
