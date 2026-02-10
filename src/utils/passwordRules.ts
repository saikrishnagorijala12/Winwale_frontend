export const passwordRules = {
  length: {
    test: (p: string) => p.length >= 8,
    label: "At least 8 characters",
  },
  lowercase: {
    test: (p: string) => /[a-z]/.test(p),
    label: "At least 1 lowercase letter",
  },
  uppercase: {
    test: (p: string) => /[A-Z]/.test(p),
    label: "At least 1 uppercase letter",
  },
  number: {
    test: (p: string) => /\d/.test(p),
    label: "At least 1 number",
  },
  special: {
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
    label: "At least 1 special character",
  },
};