import * as v from "./validators";

export type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const validateSignupForm = (data: SignupFormData) => {
  const errors: Partial<Record<keyof SignupFormData, string>> = {};

  errors.fullName = v.validateMinLength(data.fullName, 3, "Full name") ||
    v.validateMaxLength(data.fullName, 30, "Full Name") || v.validateName(data.fullName) || undefined;

  errors.email = v.validateEmail(data.email) || undefined;

  errors.password = v.validatePasswordComplexity(data.password) || undefined;

  errors.confirmPassword =
    v.validateRequired(data.confirmPassword, "Confirm password") ||
    v.validateMatch(data.password, data.confirmPassword, "Passwords") || undefined;

  const cleanErrors = Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== undefined));

  return {
    isValid: Object.keys(cleanErrors).length === 0,
    errors: cleanErrors
  };
};

// import * as v from "./validators";

// export type SignupFormData = {
//   fullName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

// const COMPANY_DOMAIN = "winvale.com";

// export const validateSignupForm = (data: SignupFormData) => {
//   const errors: Partial<Record<keyof SignupFormData, string>> = {};

//   errors.fullName =
//     v.validateMinLength(data.fullName, 3, "Full name") ||
//     v.validateMaxLength(data.fullName, 30, "Full name") ||
//     v.validateName(data.fullName) ||
//     undefined;

//   const emailError = v.validateEmail(data.email);

//   if (!emailError) {
//     const email = data.email.trim().toLowerCase();

//     if (!email.endsWith(`@${COMPANY_DOMAIN}`)) {
//       errors.email = `Only @${COMPANY_DOMAIN} email addresses are allowed.`;
//     }
//   } else {
//     errors.email = emailError;
//   }

//   errors.password =
//     v.validatePasswordComplexity(data.password) || undefined;

//   errors.confirmPassword =
//     v.validateRequired(data.confirmPassword, "Confirm password") ||
//     v.validateMatch(data.password, data.confirmPassword, "Passwords") ||
//     undefined;

//   const cleanErrors = Object.fromEntries(
//     Object.entries(errors).filter(([_, value]) => value !== undefined)
//   );

//   return {
//     isValid: Object.keys(cleanErrors).length === 0,
//     errors: cleanErrors,
//   };
// };
