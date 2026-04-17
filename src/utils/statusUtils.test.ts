import { describe, it, expect } from 'vitest';
import { normalizeStatus, getStatusLabel, getStatusStyles } from './statusUtils';

describe('statusUtils', () => {
  describe('normalizeStatus', () => {
    it('should return pending for pending status string', () => {
      expect(normalizeStatus('PENDING')).toBe('pending');
      expect(normalizeStatus('pending')).toBe('pending');
    });

    it('should return unknown for invalid or empty status', () => {
      expect(normalizeStatus('')).toBe('unknown');
      expect(normalizeStatus(undefined)).toBe('unknown');
      expect(normalizeStatus('invalid_status')).toBe('unknown');
    });

    it('should correctly normalize all known statuses', () => {
      ['active', 'inactive', 'approved', 'rejected'].forEach(status => {
        expect(normalizeStatus(status.toUpperCase())).toBe(status);
      });
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct label for a valid status', () => {
      expect(getStatusLabel('pending')).toBe('Pending');
      expect(getStatusLabel('approved')).toBe('Approved');
    });

    it('should return Unknown for an invalid status', () => {
      expect(getStatusLabel('foo')).toBe('Unknown');
    });
  });

  describe('getStatusStyles', () => {
    it('should return valid string styles', () => {
      const pendingStyles = getStatusStyles('pending');
      expect(pendingStyles).toContain('bg-orange-50');
      expect(pendingStyles).toContain('text-orange-600');
    });

    it('should return default unknown styles for invalid status', () => {
      const unknownStyles = getStatusStyles('invalid_status');
      expect(unknownStyles).toContain('bg-slate-100');
    });
  });
});
