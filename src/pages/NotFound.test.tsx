import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import NotFound from './NotFound';
import { MemoryRouter } from 'react-router-dom';

describe('NotFound Page', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders 404 message correctly', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to Home' })).toBeInTheDocument();
  });

  it('logs an error to console on mount', () => {
    render(
      <MemoryRouter initialEntries={['/invalid-route']}>
        <NotFound />
      </MemoryRouter>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/invalid-route'
    );
  });
});
