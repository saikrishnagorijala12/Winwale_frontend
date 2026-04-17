import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PendingApproval from './PendingApproval';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('PendingApproval Page', () => {
  const mockRefreshUser = vi.fn().mockResolvedValue(true);
  const mockLogout = vi.fn();

  beforeEach(() => {
    (useAuth as any).mockReturnValue({
      refreshUser: mockRefreshUser,
      logout: mockLogout,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders approval messages', () => {
    render(<PendingApproval />);
    
    expect(screen.getByText(/Your account has been created and is awaiting approval/i)).toBeInTheDocument();
    expect(screen.getByText(/Winvale Administration team/i)).toBeInTheDocument();
  });

  it('calls logout when Done is clicked', () => {
    render(<PendingApproval />);
    
    const doneButton = screen.getByRole('button', { name: 'Done' });
    fireEvent.click(doneButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('periodically refreshes user via setInterval', () => {
    render(<PendingApproval />);
    
    expect(mockRefreshUser).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(20000);
    });

    expect(mockRefreshUser).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(20000);
    });

    expect(mockRefreshUser).toHaveBeenCalledTimes(2);
  });
});
