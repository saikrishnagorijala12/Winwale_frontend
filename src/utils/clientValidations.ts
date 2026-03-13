import {
  ClientFormData,
  ClientFormErrors,
  EditingClient,
  Negotiator,
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
): { isValid: boolean; errors: ClientFormErrors } => {
  const errors: ClientFormErrors = { negotiators: {} };

  clientData.negotiators.forEach((negotiator, index) => {
    const negErrors: Partial<Record<keyof Negotiator, string>> = {};

    const nameErr = v.validateName(negotiator.name, true);
    if (nameErr) negErrors.name = nameErr;

    const emailErr = v.validateEmail(negotiator.email || "");
    if (emailErr) {
      negErrors.email = emailErr === "Email is required" ? "Email address is required" : emailErr;
    }

    const phoneErr = v.validatePhone(negotiator.phone_no || "", "Phone number");
    if (phoneErr) negErrors.phone_no = phoneErr;

    const addrLen = v.validateMaxLength(negotiator.address || "", 50, "Address");
    if (addrLen) negErrors.address = addrLen;

    const cityLen = v.validateMaxLength(negotiator.city || "", 50, "City");
    if (cityLen) negErrors.city = cityLen;

    const stateLen = v.validateMaxLength(negotiator.state || "", 50, "State");
    if (stateLen) negErrors.state = stateLen;

    const zipErr = v.validateZip(negotiator.zip || "");
    if (zipErr) negErrors.zip = zipErr;

    if (Object.keys(negErrors).length > 0) {
      errors.negotiators![index] = negErrors;
    }
  });

  return {
    isValid: Object.keys(errors.negotiators!).length === 0,
    errors,
  };
};