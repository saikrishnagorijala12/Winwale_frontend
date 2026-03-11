export const HEADER_ALIASES: Record<string, string[]> = {
    manufacturer: ["manufacturer", "manufacturer_name", "mfr", "mfr_name"],
    part_number: [
        "part_number",
        "part_no",
        "manufacturer_part_number",
        "mpn",
        "pn",
    ],
    product_name: ["product_name", "item_name", "name"],
    product_description: [
        "product_description",
        "description",
        "item_description",
        "short_description",
        "long_description",
    ],
    "commercial_list_price_(gv)": [
        "commercial_list_price_(gv)",
        "commercial_list_price_gv",
        "commercial_list_price",
        "commercial_price",
        "list_price",
        "price",
        "msrp",
        "suggested_msrp",
        "market_price",
        "market_rate",
    ],
    "country_of_origin_(coo)": [
        "country_of_origin_(coo)",
        "country_of_origin",
        "coo",
        "origin_country",
    ],
};

export const REQUIRED_COLS = [
    "part_number",
    "product_description",
    "commercial_list_price_(gv)",
];

const normalizeHeader = (header: string): string => {
    return header
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^\w]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
};

const getAliasSet = (): Set<string> => {
    const aliases = new Set<string>();
    Object.values(HEADER_ALIASES).forEach((vals) => {
        vals.forEach((v) => {
            aliases.add(normalizeHeader(v));
        });
    });
    return aliases;
};

const ALIAS_SET = getAliasSet();

export const findHeaderRow = (data: any[][]): number => {
    // Check up to 30 rows for headers
    const maxRows = Math.min(30, data.length);

    for (let i = 0; i < maxRows; i++) {
        const row = data[i];
        if (!row || !Array.isArray(row)) continue;

        const normalizedRow = row.map((cell) => normalizeHeader(String(cell)));
        const matches = normalizedRow.filter((val) => ALIAS_SET.has(val));

        if (matches.length >= 3) {
            return i;
        }
    }

    return -1;
};

export const validateHeaders = (
    headers: string[],
): { isValid: boolean; missing: string[] } => {
    const normalizedHeaders = headers.map(normalizeHeader);
    const foundCanonical = new Set<string>();

    normalizedHeaders.forEach((header) => {
        for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
            if (aliases.some((alias) => normalizeHeader(alias) === header)) {
                foundCanonical.add(canonical);
                break;
            }
        }
    });

    const missing = REQUIRED_COLS.filter((col) => !foundCanonical.has(col));

    return {
        isValid: missing.length === 0,
        missing,
    };
};

export const getDisplayColumnName = (canonicalName: string): string => {
    switch (canonicalName) {
        case "part_number":
            return "Part Number";
        case "product_description":
            return "Product Description";
        case "commercial_list_price_(gv)":
            return "Commercial List Price (GV)";
        default:
            return canonicalName;
    }
};
