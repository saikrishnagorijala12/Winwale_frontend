import { describe, it, expect } from 'vitest';
import { 
  validatePasswordComplexity, 
  validateMatch, 
  validateRequired, 
  validateEmail,
  validateZip,
  validateName
} from './validators';

describe('validators', () => {
  describe('validatePasswordComplexity', () => {
    it('requires password', () => {
      expect(validatePasswordComplexity('')).toBe('Password is required');
    });

    it('validates a strong password successfully', () => {
      expect(validatePasswordComplexity('StrongPass123!')).toBeNull();
    });

    it('fails when length is less than 8', () => {
      expect(validatePasswordComplexity('Str1!')).toMatch(/requirement not met/);
    });

    it('fails when no uppercase letter', () => {
      expect(validatePasswordComplexity('strongpass123!')).toMatch(/requirement not met/);
    });
  });

  describe('validateMatch', () => {
    it('returns error when values differ', () => {
      expect(validateMatch('abc', 'def', 'Passwords')).toBe('Passwords do not match');
    });

    it('returns null when values match', () => {
      expect(validateMatch('abc', 'abc', 'Passwords')).toBeNull();
    });
  });

  describe('validateRequired', () => {
    it('returns error for empty string or null', () => {
      expect(validateRequired('', 'Field')).toBe('Field is required');
      expect(validateRequired(null, 'Field')).toBe('Field is required');
      expect(validateRequired(undefined, 'Field')).toBe('Field is required');
    });

    it('returns null for valid string or number', () => {
      expect(validateRequired('hello', 'Field')).toBeNull();
      expect(validateRequired(123, 'Field')).toBeNull();
    });
  });

  describe('validateEmail', () => {
    it('fails on invalid email structure', () => {
      expect(validateEmail('not-an-email')).toBe('Please enter a valid email address');
      expect(validateEmail('test@test')).toBe('Please enter a valid email address');
    });

    it('succeeds on valid email structure', () => {
      expect(validateEmail('test@example.com')).toBeNull();
    });
  });

  describe('validateZip', () => {
    it('fails if non-alphanumeric or too long', () => {
      expect(validateZip('12345-678')).toBe('ZIP code must be alphanumeric and up to 7 characters');
      expect(validateZip('12345678')).toBe('ZIP code must be alphanumeric and up to 7 characters');
    });

    it('passes for standard US zip', () => {
      expect(validateZip('12345')).toBeNull();
    });
  });

  describe('validateName', () => {
    it('fails with invalid characters', () => {
      expect(validateName('John123')).toBe("Name can contain letters, spaces, and . ' - only");
    });
  });
});
