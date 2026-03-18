export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

const PHONE_REGEX =
    /^\+?1?[\s.\-]?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;

export const validatePhoneNumber = (
    input: string
): ValidationResult => {
    if (!input || input.trim() === '') {
        return { isValid: false, error: 'Phone number is required' };
    }

    const cleaned = input.trim();

    if (!PHONE_REGEX.test(cleaned)) {
        return {
            isValid: false,
            error: 'Enter a valid phone number (e.g. (555) 123-4567)',
        };
    }

    const digits = cleaned.replace(/\D/g, '');

    if (digits.length === 11 && digits[0] !== '1') {
        return { isValid: false, error: 'Invalid country code' };
    }

    if (digits.length !== 10 && digits.length !== 11) {
        return { isValid: false, error: 'Phone number must have 10 digits' };
    }

    return { isValid: true };
};


export const normalizePhoneNumber = (input: string): string | null => {
    const result = validatePhoneNumber(input);
    if (!result.isValid) return null;

    const digits = input.replace(/\D/g, '');
    const tenDigits = digits.length === 11 ? digits.slice(1) : digits;

    return `+1${tenDigits}`;
};


export const formatPhoneNumber = (e164Number: string): string => {
    if (!e164Number) return '';

    const digits = e164Number.replace(/\D/g, '');
    const ten = digits.length === 11 ? digits.slice(1) : digits;

    if (ten.length !== 10) return e164Number;

    return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
};
