import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NavLink } from './NavLink';

describe('NavLink', () => {
  it('applies the active class when the route matches', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <NavLink
          to="/dashboard"
          className="base-link"
          activeClassName="active-link"
        >
          Dashboard
        </NavLink>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass(
      'base-link',
      'active-link'
    );
  });

  it('does not apply the active class for a different route', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <NavLink
          to="/dashboard"
          className="base-link"
          activeClassName="active-link"
        >
          Dashboard
        </NavLink>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveClass('base-link');
    expect(link).not.toHaveClass('active-link');
  });
});
