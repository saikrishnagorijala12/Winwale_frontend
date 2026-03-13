export type ClientFormErrors = Partial<{
  company_name: string;
  company_email: string;
  company_phone_no: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_zip: string;
  negotiators: { [index: number]: Partial<Record<keyof Negotiator, string>> };
}>;

export interface Negotiator {
  name: string;
  title: string;
  email: string | null;
  phone_no: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface ClientContact {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export type ClientStatus =
  | "pending"
  | "active"
  | "inactive"
  | "approved"
  | "rejected"
  | "Unknown";

export interface Client {
  id: number;
  name: string;
  contract: string;
  status: ClientStatus;
  lastModification: string | null;
  negotiators: Negotiator[];
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  contractDetails?: any;
}

export interface ClientFormData {
  company_name: string;
  company_email: string;
  company_phone_no: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_zip: string;
  negotiators: Negotiator[];
  status: ClientStatus;
  logoUrl?: string;
  logoFile?: File | null;
}

export interface EditingClient extends ClientFormData {
  id: number;
}

export interface StatusMapItem {
  label: string;
  slug: string;
}