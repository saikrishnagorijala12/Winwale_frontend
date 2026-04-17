import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  const renderWithRoutes = (isAuthenticated: boolean, allowedRoles?: string[]) =>
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={allowedRoles}
              />
            }
          >
            <Route path="/admin" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/pending-approval" element={<div>Pending Approval Page</div>} />
        </Routes>
      </MemoryRouter>
    );

  it('renders children when the user is authenticated and authorized', () => {
    (useAuth as any).mockReturnValue({
      user: { role: 'admin' },
      status: 'authenticated',
      isActive: true,
    });

    renderWithRoutes(true, ['admin']);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      status: 'authenticated',
      isActive: false,
    });

    renderWithRoutes(false);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects inactive users to pending approval', () => {
    (useAuth as any).mockReturnValue({
      user: { role: 'user' },
      status: 'authenticated',
      isActive: false,
    });

    renderWithRoutes(true);

    expect(screen.getByText('Pending Approval Page')).toBeInTheDocument();
  });

  it('redirects users without an allowed role to dashboard', () => {
    (useAuth as any).mockReturnValue({
      user: { role: 'user' },
      status: 'authenticated',
      isActive: true,
    });

    renderWithRoutes(true, ['admin']);

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
