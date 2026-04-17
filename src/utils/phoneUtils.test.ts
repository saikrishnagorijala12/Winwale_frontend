import { describe, it, expect } from 'vitest';
import { validatePhoneNumber, normalizePhoneNumber, formatPhoneNumber } from './phoneUtils';

describe('phoneUtils', () => {
  describe('validatePhoneNumber', () => {
    it('fails when empty', () => {
      expect(validatePhoneNumber('')).toEqual({ isValid: false, error: 'Phone number is required' });
    });

    it('fails with invalid format', () => {
      expect(validatePhoneNumber('apple')).toEqual({ isValid: false, error: 'Enter a valid phone number (e.g. (555) 123-4567)' });
    });

    it('fails with incorrect country code', () => {
      expect(validatePhoneNumber('2 555-123-4567')).toEqual({ isValid: false, error: 'Enter a valid phone number (e.g. (555) 123-4567)' });
    });

    it('succeeds with a valid US phone number without formatting', () => {
      expect(validatePhoneNumber('5551234567')).toEqual({ isValid: true });
    });

    it('succeeds with a valid US phone number with formatting', () => {
      expect(validatePhoneNumber('(555) 123-4567')).toEqual({ isValid: true });
      expect(validatePhoneNumber('+1 555-123-4567')).toEqual({ isValid: true });
    });
  });

  describe('normalizePhoneNumber', () => {
    it('returns null on invalid input', () => {
      expect(normalizePhoneNumber('abcd')).toBeNull();
    });

    it('normalizes valid 10-digit to input compatible with E.164 (+1...)', () => {
      expect(normalizePhoneNumber('(555) 123-4567')).toBe('+15551234567');
    });

    it('normalizes valid 11-digit starting with 1', () => {
      expect(normalizePhoneNumber('+1 (555) 123-4567')).toBe('+15551234567');
      expect(normalizePhoneNumber('15551234567')).toBe('+15551234567');
    });
  });

  describe('formatPhoneNumber', () => {
    it('returns empty string if falsy', () => {
      expect(formatPhoneNumber('')).toBe('');
    });

    it('formats 10/11 digit e164 to standard US format', () => {
      expect(formatPhoneNumber('+15551234567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
    });

    it('returns original string if not a full 10 digits', () => {
      expect(formatPhoneNumber('+155512')).toBe('+155512');
    });
  });
});
