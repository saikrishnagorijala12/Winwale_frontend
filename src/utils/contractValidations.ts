import { ClientContractCreate, FormErrors } from "../types/contract.types";
import * as v from "./validators";

export const validateStep1 = (
  contract: ClientContractCreate,
  options: { skipClientId?: boolean } = {}
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!options.skipClientId) {
    const clientErr = v.validateRequired(contract.client_id, "Client");
    if (clientErr) errors.client_id = "You must select a client";
  }

  const numErr = v.validateRequired(contract.contract_number, "Contract number") || v.validateMaxLength(contract.contract_number, 50, "Contract Number");
  if (numErr) errors.contract_number = numErr;

  const nameErr = v.validateOptionalName(contract.contract_officer_name, "Name");
  if (nameErr) errors.contract_officer_name = nameErr;

  const addrErr = v.validateMaxLength(contract.contract_officer_address, 50, "Address");
  if (addrErr) errors.contract_officer_address = addrErr;

  const cityErr = v.validateMaxLength(contract.contract_officer_city, 50, "City");
  if (cityErr) errors.contract_officer_city = cityErr;

  const stateErr = v.validateMaxLength(contract.contract_officer_state, 50, "State");
  if (stateErr) errors.contract_officer_state = stateErr;

  const zipErr = v.validateZip(contract.contract_officer_zip);
  if (zipErr) errors.contract_officer_zip = zipErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateStep2 = (contract: ClientContractCreate): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  const countryErr = v.validateMaxLength(contract.origin_country, 50, "");
  if (countryErr) errors.origin_country = countryErr;

  const discountErr = v.validateRange(contract.gsa_proposed_discount, 0, 100, "Discount");
  if (discountErr) errors.gsa_proposed_discount = discountErr;

  const qvErr = v.validateMaxLength(contract.q_v_discount, 50, "Quantity/Volume Discount");
  if (qvErr) errors.q_v_discount = qvErr;

  const concessionsErr = v.validateMaxLength(contract.additional_concessions, 50, "Additional Concessions");
  if (concessionsErr) errors.additional_concessions = concessionsErr;

  const normalDeliveryErr = v.validatePositiveInteger(contract.normal_delivery_time, "Normal delivery time");
  if (normalDeliveryErr) errors.normal_delivery_time = normalDeliveryErr;

  const expeditedDeliveryErr = v.validatePositiveInteger(contract.expedited_delivery_time, "Expedited delivery time");
  if (expeditedDeliveryErr) errors.expedited_delivery_time = expeditedDeliveryErr;

  if (!contract.fob_term) errors.fob_term = "FOB term is required";
  if (!contract.energy_star_compliance) errors.energy_star_compliance = "Energy Star compliance is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};