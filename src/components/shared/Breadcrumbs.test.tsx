import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders links for non-terminal items and plain text for the last item', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Clients', path: '/clients' },
            { label: 'Details' },
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(screen.getByRole('link', { name: 'Clients' })).toHaveAttribute(
      'href',
      '/clients'
    );
    expect(screen.getByText('Details').tagName).toBe('SPAN');
  });
});
