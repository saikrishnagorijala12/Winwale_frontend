import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../types/client.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{1,14}$/;
const ZIP_REGEX = /^[A-Za-z0-9]{1,7}$/;


export const validateStep1 = (
  clientData: ClientFormData | EditingClient,
  setErrors: (errors: ClientFormErrors) => void,
): boolean => {
  const newErrors: ClientFormErrors = {};

  if (!clientData.company_name?.trim()) {
    newErrors.company_name = "Company Name is required";
  } else if (clientData.company_name.length > 30) {
    newErrors.company_name = "Max 30 characters allowed";
  }

  if (!clientData.company_email?.trim()) {
    newErrors.company_email = "Company Email is required";
  } else if (!EMAIL_REGEX.test(clientData.company_email)) {
    newErrors.company_email = "Please enter a valid email address";
  } else if (clientData.company_email.length > 50) {
    newErrors.company_email = "Max 50 characters allowed";
  }

  if (!clientData.company_phone_no?.trim()) {
    newErrors.company_phone_no = "Company Phone is required";
  } else if (!PHONE_REGEX.test(clientData.company_phone_no)) {
    newErrors.company_phone_no =
      "Phone number must be up to 14 digits and may start with +";
  }

  if (!clientData.company_address?.trim()) {
    newErrors.company_address = "Company Address is required";
  } else if (clientData.company_address.length > 50) {
    newErrors.company_address = "Max 50 characters allowed";
  }

  if (!clientData.company_city?.trim()) {
    newErrors.company_city = "City is required";
  } else if (clientData.company_city.length > 50) {
    newErrors.company_city = "Max 50 characters allowed";
  }

  if (!clientData.company_state?.trim()) {
    newErrors.company_state = "State is required";
  } else if (clientData.company_state.length > 50) {
    newErrors.company_state = "Max 50 characters allowed";
  }

  if (!clientData.company_zip?.trim()) {
    newErrors.company_zip = "ZIP is required";
  } else if (!ZIP_REGEX.test(clientData.company_zip)) {
    newErrors.company_zip =
      "ZIP must be alphanumeric and max 7 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


export const validateStep2 = (
  clientData: ClientFormData | EditingClient,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!clientData.contact_officer_name?.trim()) {
    errors.contact_officer_name = "Primary contact name is required";
  } else if (clientData.contact_officer_name.length > 30) {
    errors.contact_officer_name = "Max 30 characters allowed";
  }

  if (!clientData.contact_officer_email?.trim()) {
    errors.contact_officer_email = "Email address is required";
  } else if (!EMAIL_REGEX.test(clientData.contact_officer_email)) {
    errors.contact_officer_email = "Please enter a valid email address";
  } else if (clientData.contact_officer_email.length > 50) {
    errors.contact_officer_email = "Max 50 characters allowed";
  }

  if (!clientData.contact_officer_phone_no?.trim()) {
    errors.contact_officer_phone_no = "Phone number is required";
  } else if (!PHONE_REGEX.test(clientData.contact_officer_phone_no)) {
    errors.contact_officer_phone_no =
      "Phone number must be up to 15 digits and may start with +";
  }

  if (
    clientData.contact_officer_address &&
    clientData.contact_officer_address.length > 50
  ) {
    errors.contact_officer_address = "Max 50 characters allowed";
  }

  if (
    clientData.contact_officer_city &&
    clientData.contact_officer_city.length > 50
  ) {
    errors.contact_officer_city = "Max 50 characters allowed";
  }

  if (
    clientData.contact_officer_state &&
    clientData.contact_officer_state.length > 50
  ) {
    errors.contact_officer_state = "Max 50 characters allowed";
  }

  if (
    clientData.contact_officer_zip &&
    !ZIP_REGEX.test(clientData.contact_officer_zip)
  ) {
    errors.contact_officer_zip =
      "ZIP must be alphanumeric and max 7 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

