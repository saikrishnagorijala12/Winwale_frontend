import {
    parsePhoneNumberWithError,
    CountryCode,
    PhoneNumber,
    ParseError
} from 'libphonenumber-js';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    phoneNumber?: PhoneNumber;
}


export const validatePhoneNumber = (
  input: string,
  defaultCountry: CountryCode = "US"
): ValidationResult => {
  if (!input || input.trim() === "") {
    return { isValid: false, error: "Phone number is required" };
  }

  try {
    const phoneNumber = parsePhoneNumberWithError(input, defaultCountry);

    if (!phoneNumber.isPossible()) {
      return {
        isValid: false,
        error: "Phone number length is invalid"
      };
    }

    if (!phoneNumber.isValid()) {
      return {
        isValid: false,
        error: `Invalid phone number for ${defaultCountry}`
      };
    }

    return { isValid: true, phoneNumber };

  } catch (error) {
    if (error instanceof ParseError) {
      switch (error.message) {
        case "NOT_A_NUMBER":
          return { isValid: false, error: "Enter a valid phone number" };

        case "TOO_SHORT":
          return { isValid: false, error: "Phone number is too short" };

        case "TOO_LONG":
          return { isValid: false, error: "Phone number is too long" };

        case "INVALID_COUNTRY":
          return { isValid: false, error: "Invalid country code" };

        default:
          return { isValid: false, error: "Invalid phone number format" };
      }
    }

    return { isValid: false, error: "Invalid phone number" };
  }
};

export const normalizePhoneNumber = (
    input: string,
    defaultCountry: CountryCode = 'US'
): string | null => {
    const result = validatePhoneNumber(input, defaultCountry);

    if (result.isValid && result.phoneNumber) {
        return result.phoneNumber.format('E.164');
    }

    return null;
};


export const formatPhoneNumber = (e164Number: string): string => {
    if (!e164Number) return '';

    try {
        const phoneNumber = parsePhoneNumberWithError(e164Number);
        return phoneNumber.formatNational();
    } catch (error) {
        return e164Number;
    }
};
