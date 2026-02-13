export interface Client {
  client_id: number;
  company_name: string;
  company_email: string;
  status: string;
}

export interface Product {
  product_id: number;
  client_id: number;
  client_name: string | null;

  item_type: string;
  item_name: string;
  item_description?: string | null;

  manufacturer: string;
  manufacturer_part_number: string;
  client_part_number?: string | null;

  sin?: string | null;
  commercial_list_price?: number | null;

  country_of_origin?: string | null;
  recycled_content_percent?: number | null;

  uom?: string | null;
  quantity_per_pack?: number | null;
  quantity_unit_uom?: string | null;

  nsn?: string | null;
  upc?: string | null;
  unspsc?: string | null;

  hazmat?: string | null;
  product_info_code?: string | null;

  url_508?: string | null;
  product_url?: string | null;

  row_signature?: string;

  created_time?: string | null;
  updated_time?: string | null;

  dim_id?: number | null;

  length?: number | null;
  width?: number | null;
  height?: number | null;

  physical_uom?: string | null;
  weight_lbs?: number | null;
  warranty_period?: string | null;

  photo_type?: string | null;
  photo_path?: string | null;

  dim_created_time?: string | null;
  dim_updated_time?: string | null;
}

export interface ProductsList {
  total: number;
  items: Product[];
}
