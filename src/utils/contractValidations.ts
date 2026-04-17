import { ClientContractCreate, FormErrors } from "../types/contract.types";
import * as v from "./validators";

export const validateStep1 = (
  contract: ClientContractCreate,
  options: { skipClientId?: boolean } = {}
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!options.skipClientId) {
    const clientErr = v.validateRequired(contract.client_id, "Client");
    if (clientErr) errors.client_id = clientErr;
  }

  const numErr =
    v.validateRequired(contract.contract_number, "Contract Number") ||
    v.validateMaxLength(contract.contract_number, 50, "Contract Number");
  if (numErr) errors.contract_number = numErr;

  const nameErr =

    v.validateRequired(contract.contract_officer_name, "Contract Officer Name") ||
    v.validateOptionalName(contract.contract_officer_name, "Name");
  if (nameErr) errors.contract_officer_name = nameErr;

  const addrErr =
    v.validateRequired(contract.contract_officer_address, "GSA Office Address") ||
    v.validateMaxLength(contract.contract_officer_address, 50, "Address");
  if (addrErr) errors.contract_officer_address = addrErr;

  const cityErr =
    v.validateRequired(contract.contract_officer_city, "GSA Office City") ||
    v.validateMaxLength(contract.contract_officer_city, 50, "City");
  if (cityErr) errors.contract_officer_city = cityErr;

  const stateErr =
    v.validateRequired(contract.contract_officer_state, "State") ||
    v.validateMaxLength(contract.contract_officer_state, 50, "State");
  if (stateErr) errors.contract_officer_state = stateErr;

  const zipErr =
    v.validateRequired(contract.contract_officer_zip, "ZIP") ||
    v.validateZip(contract.contract_officer_zip);
  if (zipErr) errors.contract_officer_zip = zipErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateStep2 = (
  contract: ClientContractCreate
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  const countryErr =
    v.validateRequired(contract.origin_country, "Country") ||
    v.validateMaxLength(contract.origin_country, 50, "Country");
  if (countryErr) errors.origin_country = countryErr;

  const discountErr =
    v.validateRequired(contract.gsa_proposed_discount, "Discount") ||
    (contract.gsa_proposed_discount !== undefined
      ? v.validateRange(contract.gsa_proposed_discount, 0, 100, "Discount")
      : null);
  if (discountErr) errors.gsa_proposed_discount = discountErr;

  const qvErr =
    v.validateRequired(contract.q_v_discount, "Quantity/Volume Discount") ||
    v.validateMaxLength(contract.q_v_discount, 50, "Quantity/Volume Discount");
  if (qvErr) errors.q_v_discount = qvErr;

  const epaErr =
    v.validateRequired(contract.epa_method_mechanism, "EPA Method / Mechanism") ||
    v.validateMaxLength(contract.epa_method_mechanism, 255, "EPA Method / Mechanism");
  if (epaErr) errors.epa_method_mechanism = epaErr;

  const concessionsErr =
    v.validateRequired(contract.additional_concessions, "Additional Concessions") ||
    v.validateMaxLength(contract.additional_concessions, 50, "Additional Concessions");
  if (concessionsErr) errors.additional_concessions = concessionsErr;

  const normalDeliveryErr =
    v.validateRequired(contract.normal_delivery_time, "Normal Delivery Time") ||
    (contract.normal_delivery_time !== undefined
      ? v.validatePositiveInteger(
          contract.normal_delivery_time,
          "Normal delivery time",
        )
      : null);
  if (normalDeliveryErr) errors.normal_delivery_time = normalDeliveryErr;

  const expeditedDeliveryErr =
    v.validateRequired(contract.expedited_delivery_time, "Expedited Delivery Time");
  if (expeditedDeliveryErr) errors.expedited_delivery_time = expeditedDeliveryErr;

  const fobErr = v.validateRequired(contract.fob_term, "FOB Term");
  if (fobErr) errors.fob_term = fobErr;

  const energyErr = v.validateRequired(contract.energy_star_compliance, "Energy Star Compliance");
  if (energyErr) errors.energy_star_compliance = energyErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
