import { Client, ClientFormData, ClientStatus } from "../types/client.types";
import { normalizeStatus } from "../utils/statusUtils";

export const normalizeClientFromAPI = (c: any): Client => {
  const hasContact =
    c.contact_officer_name ||
    c.contact_officer_email ||
    c.contact_officer_phone_no ||
    c.contact_officer_address;

  return {
    id: c.client_id,
    name: c.company_name,
    contract: c.contract_number || "—",
    status: normalizeStatus(c.status) as ClientStatus,
    products: c.products_count ?? 0,
    lastModification:
      (c.updated_time || c.created_time)?.split("T")[0] ?? "—",
    contact: hasContact
      ? {
          name: c.contact_officer_name?.trim() || null,
          email: c.contact_officer_email?.trim() || null,
          phone: c.contact_officer_phone_no?.trim() || null,
          address: [
            c.contact_officer_address,
            c.contact_officer_city,
            c.contact_officer_state,
            c.contact_officer_zip,
          ]
            .filter(Boolean)
            .join(", ") || null,
        }
      : null,
    email: c.company_email,
    phone: c.company_phone_no,
    address: [
      c.company_address,
      c.company_city,
      c.company_state,
      c.company_zip,
    ]
      .filter(Boolean)
      .join(", "),
  };
};


export const createClientFromResponse = (res: any): Client => {
  return {
    id: res.data.client_id,
    name: res.data.company_name,
    contract: res.data.contract_number || "—",
    status: res.data.status as ClientStatus,
    products: 0,
    lastModification: res.data.created_at?.split("T")[0] ?? "—",
    contact:
      res.data.contact_officer_name ||
      res.data.contact_officer_email ||
      res.data.contact_officer_phone_no
        ? {
            name: res.data.contact_officer_name || null,
            email: res.data.contact_officer_email || null,
            phone: res.data.contact_officer_phone_no || null,
            address: [
              res.data.contact_officer_address,
              res.data.contact_officer_city,
              res.data.contact_officer_state,
              res.data.contact_officer_zip,
            ]
              .filter(Boolean)
              .join(", ") || null,
          }
        : null,
    email: res.data.company_email,
    phone: res.data.company_phone_no,
    address: [
      res.data.company_address,
      res.data.company_city,
      res.data.company_state,
      res.data.company_zip,
    ]
      .filter(Boolean)
      .join(", "),
  };
};

export const updateClientFromResponse = (res: any, products: number): Client => {
  return {
    id: res.data.client_id,
    name: res.data.company_name,
    contract: res.data.contract_number || "—",
    status: res.data.status as ClientStatus,
    products: products || 0,
    lastModification: res.data.updated_time?.split("T")[0] ?? "—",
    contact:
      res.data.contact_officer_name ||
      res.data.contact_officer_email ||
      res.data.contact_officer_phone_no
        ? {
            name: res.data.contact_officer_name || null,
            email: res.data.contact_officer_email || null,
            phone: res.data.contact_officer_phone_no || null,
            address: [
              res.data.contact_officer_address,
              res.data.contact_officer_city,
              res.data.contact_officer_state,
              res.data.contact_officer_zip,
            ]
              .filter(Boolean)
              .join(", ") || null,
          }
        : null,
    email: res.data.company_email,
    phone: res.data.company_phone_no,
    address: [
      res.data.company_address,
      res.data.company_city,
      res.data.company_state,
      res.data.company_zip,
    ]
      .filter(Boolean)
      .join(", "),
  };
};

export const getInitialFormData = (): ClientFormData => ({
  company_name: "",
  company_email: "",
  company_phone_no: "",
  company_address: "",
  company_city: "",
  company_state: "",
  company_zip: "",
  contact_officer_name: "",
  contact_officer_email: "",
  contact_officer_phone_no: "",
  contact_officer_address: "",
  contact_officer_city: "",
  contact_officer_state: "",
  contact_officer_zip: "",
  status: "pending",
});