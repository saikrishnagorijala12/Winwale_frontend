// Regex Patterns
export const COMPANY_NAME_REGEX = /^[A-Za-z0-9]+(?:[A-Za-z0-9 .,'&()\-]*[A-Za-z0-9])?$/;
export const NAME_REGEX = /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?\d{1,14}$/;
export const ZIP_REGEX = /^[A-Za-z0-9]{1,7}$/;


export const PASSWORD_RULES = {
  length: { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  lowercase: { test: (p: string) => /[a-z]/.test(p), label: "At least 1 lowercase letter" },
  uppercase: { test: (p: string) => /[A-Z]/.test(p), label: "At least 1 uppercase letter" },
  number: { test: (p: string) => /\d/.test(p), label: "At least 1 number" },
  special: { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "At least 1 special character" },
};

export const validatePasswordComplexity = (p: string) => {
  if (!p) return "Password is required";
  const failedRule = Object.values(PASSWORD_RULES).find((rule) => !rule.test(p));
  if (failedRule) return "Password does not meet requirements";
  return null;
};

export const validateMatch = (val1: string, val2: string, label: string) => {
  if (val1 !== val2) return `${label} do not match`;
  return null;
};

export const validateRequired = (value: any, fieldName: string) => {
  if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string | undefined, min: number, label: string) => {
  if (value && value.length < min) return `${label} must be at least ${min} characters`;
  return null;
};

export const validateMaxLength = (value: string | undefined, max: number, label: string ) => {
  if (value && value.length > max) return `${label} must be under ${max} characters`;
  return null;
};

export const validateEmail = (value: string | undefined) => {
  if (!value?.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address";
  return validateMaxLength(value, 50,"Email");
};

export const validatePhone = (value: string | undefined, label: string = "Phone number") => {
  if (!value?.trim()) return `${label} is required`;
  if (!PHONE_REGEX.test(value)) return `${label} must be up to 14 digits and may start with +`;
  return null;
};

export const validateZip = (value: string | undefined) => {
  if (value && !ZIP_REGEX.test(value)) {
    return "ZIP code must be alphanumeric and up to 7 characters";
  }
  return null;
};

export const validateName = (value: string | undefined, isCompany = false) => {
  const trimmed = value?.trim() || "";
  const label = isCompany ? "Company name" : "Name";
  const regex = isCompany ? COMPANY_NAME_REGEX : NAME_REGEX;
  
  if (!trimmed) return `${label} is required`;
  if (!regex.test(trimmed)) {
    return isCompany 
      ? "Company name can contain letters, numbers, spaces, and . , ' & ( ) - only"
      : "Name can contain letters, spaces, and . ' - only";
  }
  return validateMaxLength(trimmed, 30,"Name");
};

export const validateOptionalName = (value: string | undefined, fieldLabel: string = "Name") => {
  const trimmed = value?.trim() || "";
  if (!trimmed) return null;
  if (!NAME_REGEX.test(trimmed)) {
    return `${fieldLabel} can contain letters, spaces, and . ' - only`;
  }
  return validateMaxLength(trimmed, 30,"Name");
};

export const validateRange = (value: number, min: number, max: number, label: string) => {
  if (value < min || value > max) {
    return `${label} must be between ${min} and ${max}`;
  }
  return null;
};

export const validatePositiveInteger = (value: number, label: string) => {
  if (!Number.isInteger(value) || value < 0) {
    return `${label} must be a positive number`;
  }
  return null;
};