export type ClientFormErrors = Partial<{
  company_name: string;
  company_email: string;
  company_phone_no: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_zip: string;
  contact_officer_name: string;
  contact_officer_email: string;
  contact_officer_phone_no: string;
  contact_officer_address: string;
  contact_officer_city: string;
  contact_officer_state: string;
  contact_officer_zip: string;
}>;

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
  products: number;
  lastModification: string | null;
  contact: ClientContact | null;
  email: string;
  phone: string;
  address: string;
}

export interface ClientFormData {
  company_name: string;
  company_email: string;
  company_phone_no: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_zip: string;
  contact_officer_name: string;
  contact_officer_email: string;
  contact_officer_phone_no: string;
  contact_officer_address: string;
  contact_officer_city: string;
  contact_officer_state: string;
  contact_officer_zip: string;
  status: ClientStatus;
}

export interface EditingClient extends ClientFormData {
  id: number;
  products?: number;
}

export interface StatusMapItem {
  label: string;
  slug: string;
}