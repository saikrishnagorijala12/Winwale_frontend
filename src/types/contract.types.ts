export interface ClientContractBase {
  contract_number: string;
  contract_officer_name?: string;
  contract_officer_address?: string;
  contract_officer_city?: string;
  contract_officer_state?: string;
  contract_officer_zip?: string;
  origin_country?: string;
  gsa_proposed_discount?: number;
  q_v_discount?: string;
  additional_concessions?: string;
  normal_delivery_time?: number;
  expedited_delivery_time?: number;
  fob_term?: string;
  energy_star_compliance?: string;
}

export interface ClientContractRead extends ClientContractBase {
  client: string;
  client_profile_id: number;
  client_id: number;
  is_deleted: boolean;
  created_time: string;
  updated_time: string;
}

export interface ClientContractCreate extends ClientContractBase {
  client_id?: number;
  is_deleted?: boolean;
}

export interface ClientContractUpdate extends ClientContractBase {
  is_deleted?: boolean;
}

export interface ClientListRead {
  client_id: number;
  company_name: string;
}

export interface FormErrors {
  [key: string]: string;
}