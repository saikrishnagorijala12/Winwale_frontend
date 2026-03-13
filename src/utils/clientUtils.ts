import { Client, ClientFormData, ClientStatus } from "../types/client.types";
import { normalizeStatus } from "../utils/statusUtils";

export const normalizeClientFromAPI = (c: any): Client => {
  return {
    id: c.client_id,
    name: c.company_name,
    contract: c.contract?.contract_number || c.contract_number || "—",
    status: normalizeStatus(c.status) as ClientStatus,
    lastModification:
      (c.updated_time || c.created_time)?.split("T")[0] ?? "—",
    negotiators: (c.negotiators || []).map((n: any) => ({
      name: n.name || "",
      title: n.title || "",
      email: n.email || null,
      phone_no: n.phone_no || null,
      address: n.address || null,
      city: n.city || null,
      state: n.state || null,
      zip: n.zip || null,
    })),
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
    logoUrl: c.company_logo_url,
    contractDetails: c.contract,
  };
};

export const createClientFromResponse = (res: any): Client => {
  return normalizeClientFromAPI(res.data);
};

export const updateClientFromResponse = (res: any): Client => {
  return normalizeClientFromAPI(res.data);
};

export const getInitialFormData = (): ClientFormData => ({
  company_name: "",
  company_email: "",
  company_phone_no: "",
  company_address: "",
  company_city: "",
  company_state: "",
  company_zip: "",
  negotiators: [
    {
      name: "",
      title: "",
      email: "",
      phone_no: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  ],
  status: "pending",
  logoUrl: "",
  logoFile: null,
});