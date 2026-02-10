import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
} from "../types/client.types";
import * as v from "./validators";

export const validateStep1 = (
  clientData: ClientFormData | EditingClient,
  setErrors: (errors: ClientFormErrors) => void,
): boolean => {
  const newErrors: ClientFormErrors = {};

  const companyNameErr = v.validateName(clientData.company_name, true);
  if (companyNameErr) newErrors.company_name = companyNameErr;

  const emailErr = v.validateEmail(clientData.company_email);
  if (emailErr) newErrors.company_email = emailErr;

  const phoneErr = v.validatePhone(clientData.company_phone_no, "Company Phone");
  if (phoneErr) newErrors.company_phone_no = phoneErr;

  const addrErr = v.validateRequired(clientData.company_address, "Company Address") || v.validateMaxLength(clientData.company_address, 50,"Address");
  if (addrErr) newErrors.company_address = addrErr;

  const cityErr = v.validateRequired(clientData.company_city, "City") || v.validateMaxLength(clientData.company_city, 50,"City");
  if (cityErr) newErrors.company_city = cityErr;

  const stateErr = v.validateRequired(clientData.company_state, "State") || v.validateMaxLength(clientData.company_state, 50,"State");
  if (stateErr) newErrors.company_state = stateErr;

  const zipRequired = v.validateRequired(clientData.company_zip, "ZIP");
  const zipFormat = v.validateZip(clientData.company_zip);
  if (zipRequired || zipFormat) newErrors.company_zip = zipRequired || zipFormat || "";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const validateStep2 = (
  clientData: ClientFormData | EditingClient,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const nameErr = v.validateName(clientData.contact_officer_name, false);
  if (nameErr) errors.contact_officer_name = nameErr;

  const emailErr = v.validateEmail(clientData.contact_officer_email);
  if (emailErr) {
    errors.contact_officer_email = emailErr === "Email is required" ? "Email address is required" : emailErr;
  }

  const phoneErr = v.validatePhone(clientData.contact_officer_phone_no, "Phone number");
  if (phoneErr) errors.contact_officer_phone_no = phoneErr;

  const addrLen = v.validateMaxLength(clientData.contact_officer_address, 50,"Address");
  if (addrLen) errors.contact_officer_address = addrLen;

  const cityLen = v.validateMaxLength(clientData.contact_officer_city, 50,"City");
  if (cityLen) errors.contact_officer_city = cityLen;

  const stateLen = v.validateMaxLength(clientData.contact_officer_state, 50,"State");
  if (stateLen) errors.contact_officer_state = stateLen;

  const zipErr = v.validateZip(clientData.contact_officer_zip);
  if (zipErr) errors.contact_officer_zip = zipErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};