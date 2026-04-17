import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renders a normalized known status label', () => {
    render(<StatusBadge status="approved" />);

    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('falls back to unknown for unsupported statuses', () => {
    render(<StatusBadge status="archived" />);

    const badge = screen.getByText('Unknown');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-slate-100');
  });
});
