import * as v from "./validators";
import { ValidationError } from "../types/document.types";

interface DocumentField {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    validation?: Array<{
        type: string;
        message: string;
        params?: Record<string, any>;
    }>;
}

export const validateDocumentField = (
    field: DocumentField,
    value: string | number | undefined
): string | null => {
    const fieldValue = typeof value === "string" ? value.trim() : value;
    const fieldLabel = field.label;

    if (field.required) {
        const requiredError = v.validateRequired(fieldValue, fieldLabel);
        if (requiredError) return requiredError;
    }

    if (!fieldValue && fieldValue !== 0) {
        return null;
    }

    switch (field.type) {
        case "email":
            return v.validateEmail(String(fieldValue));

        case "phone":
            return v.validatePhone(String(fieldValue), fieldLabel);

        case "zip":
            return v.validateZip(String(fieldValue));

        case "number": {
            const numValue = Number(fieldValue);
            if (isNaN(numValue)) {
                return `${fieldLabel} must be a valid number`;
            }
            if (field.validation?.some((rule) => rule.type === "positiveInteger")) {
                return v.validatePositiveInteger(numValue, fieldLabel);
            }
            const rangeRule = field.validation?.find((rule) => rule.type === "range");
            if (rangeRule?.params) {
                return v.validateRange(
                    numValue,
                    rangeRule.params.min,
                    rangeRule.params.max,
                    fieldLabel
                );
            }
            break;
        }

        case "text":
        case "textarea": {
            const strValue = String(fieldValue);

            if (field.validation?.some((rule) => rule.type === "name")) {
                const isCompany = field.id.toLowerCase().includes("company");
                const nameError = v.validateName(strValue, isCompany);
                if (nameError) return nameError;
            }

            const maxLengthRule = field.validation?.find(
                (rule) => rule.type === "maxLength"
            );
            if (maxLengthRule?.params?.max) {
                const maxError = v.validateMaxLength(
                    strValue,
                    maxLengthRule.params.max,
                    fieldLabel
                );
                if (maxError) return maxError;
            } else {
                const defaultMax = field.type === "textarea" ? 500 : 100;
                const defaultError = v.validateMaxLength(strValue, defaultMax, fieldLabel);
                if (defaultError) return defaultError;
            }

            const minLengthRule = field.validation?.find(
                (rule) => rule.type === "minLength"
            );
            if (minLengthRule?.params?.min) {
                const minError = v.validateMinLength(
                    strValue,
                    minLengthRule.params.min,
                    fieldLabel
                );
                if (minError) return minError;
            }
            break;
        }

        case "date": {
            const dateValue = String(fieldValue);
            if (dateValue && !Date.parse(dateValue)) {
                return `${fieldLabel} must be a valid date`;
            }
            break;
        }

        case "select": {
            break;
        }
    }

    if (field.validation) {
        for (const rule of field.validation) {
            switch (rule.type) {
                case "email":
                    if (typeof fieldValue === "string") {
                        const emailError = v.validateEmail(fieldValue);
                        if (emailError) return rule.message || emailError;
                    }
                    break;

                case "phone":
                    if (typeof fieldValue === "string") {
                        const phoneError = v.validatePhone(fieldValue, fieldLabel);
                        if (phoneError) return rule.message || phoneError;
                    }
                    break;

                case "required":
                    break;
            }
        }
    }

    return null;
};

export const validateAllDocumentFields = (
    fields: DocumentField[],
    formData: Record<string, string | number>
): ValidationError[] => {
    const errors: ValidationError[] = [];

    fields.forEach((field) => {
        const value = formData[field.id];
        const errorMessage = validateDocumentField(field, value);

        if (errorMessage) {
            errors.push({
                fieldId: field.id,
                message: errorMessage,
            });
        }
    });

    return errors;
};

export const validateSingleField = (
    fieldId: string,
    fields: DocumentField[],
    formData: Record<string, string | number>
): string | null => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return null;

    const value = formData[fieldId];
    return validateDocumentField(field, value);
};
