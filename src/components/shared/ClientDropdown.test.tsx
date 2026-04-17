import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ClientDropdown } from './ClientDropdown';

describe('ClientDropdown', () => {
  const clients = [
    { client_id: 1, company_name: 'Acme Corp', contract_number: 'GS-001' },
    { client_id: 2, company_name: 'Beta LLC', contract_number: 'GS-002' },
  ];

  it('shows the selected client label', () => {
    render(
      <ClientDropdown
        clients={clients as any}
        selectedClient={1}
        onClientSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Acme Corp (GS-001)')).toBeInTheDocument();
  });

  it('opens, filters, and selects a client', () => {
    const onClientSelect = vi.fn();

    render(
      <ClientDropdown
        clients={clients as any}
        selectedClient={null}
        onClientSelect={onClientSelect}
      />
    );

    fireEvent.click(screen.getByText('Choose an approved client...'));
    fireEvent.change(screen.getByPlaceholderText('Search by company name...'), {
      target: { value: 'Beta' },
    });

    fireEvent.click(screen.getByText('Beta LLC'));

    expect(onClientSelect).toHaveBeenCalledWith(2);
  });

  it('supports the all clients option', () => {
    const onClientSelect = vi.fn();

    render(
      <ClientDropdown
        clients={clients as any}
        selectedClient={null}
        onClientSelect={onClientSelect}
        allowAll={true}
      />
    );

    fireEvent.click(screen.getByText('Choose an approved client...'));
    fireEvent.click(screen.getByText('All Clients'));

    expect(onClientSelect).toHaveBeenCalledWith(0);
  });
});
