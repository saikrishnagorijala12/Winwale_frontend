import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFileDrop } from './useFileDrop';

describe('useFileDrop', () => {
  it('should initialize with isDragging false', () => {
    const { result } = renderHook(() => useFileDrop({ onFileDrop: vi.fn() }));
    expect(result.current.isDragging).toBe(false);
  });

  it('should set isDragging to true on drag over', () => {
    const { result } = renderHook(() => useFileDrop({ onFileDrop: vi.fn() }));
    
    act(() => {
      const e = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
      result.current.handleDragOver(e);
    });

    expect(result.current.isDragging).toBe(true);
  });

  it('should set isDragging to false on drag leave', () => {
    const { result } = renderHook(() => useFileDrop({ onFileDrop: vi.fn() }));
    
    act(() => {
      // First set it to true
      result.current.handleDragOver({ preventDefault: vi.fn(), stopPropagation: vi.fn() } as any);
    });
    
    act(() => {
      // Then leave
      const e = { 
        preventDefault: vi.fn(), 
        stopPropagation: vi.fn(), 
        currentTarget: { contains: () => false },
        relatedTarget: null
      } as any;
      result.current.handleDragLeave(e);
    });

    expect(result.current.isDragging).toBe(false);
  });

  it('should call onFileDrop with valid files', () => {
    const onFileDrop = vi.fn();
    const { result } = renderHook(() => useFileDrop({ onFileDrop }));
    
    const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    act(() => {
      const e = { 
        preventDefault: vi.fn(), 
        stopPropagation: vi.fn(), 
        dataTransfer: { files: [file] }
      } as any;
      result.current.handleDrop(e);
    });

    expect(onFileDrop).toHaveBeenCalledWith([file]);
  });
  
  it('should call onInvalidFile with invalid files', () => {
    const onFileDrop = vi.fn();
    const onInvalidFile = vi.fn();
    const { result } = renderHook(() => useFileDrop({ onFileDrop, onInvalidFile }));
    
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    
    act(() => {
      const e = { 
        preventDefault: vi.fn(), 
        stopPropagation: vi.fn(), 
        dataTransfer: { files: [file] }
      } as any;
      result.current.handleDrop(e);
    });

    expect(onFileDrop).not.toHaveBeenCalled();
    expect(onInvalidFile).toHaveBeenCalledWith("Invalid file type. Please drop Excel (.xlsx or .xls) files.");
  });
});
