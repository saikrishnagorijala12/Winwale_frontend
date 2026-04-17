import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('should call handler when clicking outside', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickOutside(ref, handler));

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when clicking inside', () => {
    const handler = vi.fn();
    const div = document.createElement('div');
    const ref = { current: div };
    
    renderHook(() => useClickOutside(ref, handler));

    act(() => {
      div.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler if disabled', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    
    renderHook(() => useClickOutside(ref, handler, false));

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
