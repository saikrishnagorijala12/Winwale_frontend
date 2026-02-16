export interface Client {
    client_id: string;
    company_name: string;
    contract_number?: string | null;
    has_products?: Boolean;
}

export interface Step {
    id: number;
    title: string;
    description: string;
}

export interface Action {
    action_type: string;
    manufacturer_part_number?: string;
    product_name?: string;
    old_description?: string;
    new_description?: string;
    old_price?: string | number;
    new_price?: string | number;
    description?: string;
    price?: string | number;
}

export interface CategorizedActions {
    additions: Action[];
    deletions: Action[];
    priceIncreases: Action[];
    priceDecreases: Action[];
    descriptionChanges: Action[];
}
