import { ClientFormErrors, ClientFormData, EditingClient } from '../types/client.types';

export const validateStep1 = (
  clientData: ClientFormData | EditingClient,
  setErrors: (errors: ClientFormErrors) => void
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

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};