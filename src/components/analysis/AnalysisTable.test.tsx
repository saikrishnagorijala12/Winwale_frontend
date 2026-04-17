import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnalysisTable from './AnalysisTable';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../context/AnalysisContext', () => ({
  useAnalysis: () => ({ setSelectedJobId: vi.fn() }),
}));

describe('AnalysisTable', () => {
  const defaultProps = {
    analysisHistory: [],
    totalItems: 0,
    loading: false,
    currentPage: 1,
    setCurrentPage: vi.fn(),
    itemsPerPage: 10,
    sortConfig: { key: 'date', direction: 'desc' } as any,
    onSort: vi.fn(),
    updatingId: null,
    onUpdateStatus: vi.fn()
  };

  it('renders loading state correctly', () => {
    render(
      <MemoryRouter>
        <AnalysisTable {...defaultProps} loading={true} />
      </MemoryRouter>
    );
    // Since there are two views (Desktop and Mobile), it finds two loading indicators
    const loadingElements = screen.getAllByText('Loading Analysis History...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders empty state correctly when no analysisHistory', () => {
    render(
      <MemoryRouter>
        <AnalysisTable {...defaultProps} analysisHistory={[]} />
      </MemoryRouter>
    );
    const emptyElements = screen.getAllByText('No analyses found');
    expect(emptyElements.length).toBeGreaterThan(0);
  });

  it('renders table headers and components correctly', () => {
    const analysisHistory = [
      {
        job_id: 1,
        client: 'Client A',
        contract_number: '1234',
        status: 'pending',
        summary: { additions: 0, deletions: 0, priceIncreases: 0, priceDecreases: 0, descriptionChanges: 0, noChanges: 1 },
        created_time: '2023-01-01T00:00:00Z',
        user: 'User A',
        file_name: 'test.xlsx',
        file_size: 1234
      }
    ] as any;

    render(
      <MemoryRouter>
        <AnalysisTable {...defaultProps} analysisHistory={analysisHistory} />
      </MemoryRouter>
    );

    expect(screen.getByText('Analysis ID')).toBeInTheDocument();
    expect(screen.getAllByText('ANAL-JOB-1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Client A').length).toBeGreaterThan(0);
  });
});
