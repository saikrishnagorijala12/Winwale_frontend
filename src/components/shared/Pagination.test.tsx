import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders nothing when there are no pages', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalItems={0}
        itemsPerPage={10}
        onPageChange={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the current visible range', () => {
    render(
      <Pagination
        currentPage={2}
        totalItems={45}
        itemsPerPage={10}
        onPageChange={vi.fn()}
        label="products"
      />
    );

    expect(screen.getByText(/Showing/i)).toHaveTextContent('Showing 11 to 20 of 45 products');
  });

  it('calls onPageChange from previous, next, and page buttons', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={3}
        totalItems={80}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    fireEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4);
    expect(onPageChange).toHaveBeenNthCalledWith(3, 4);
  });

  it('renders ellipsis for long page ranges', () => {
    render(
      <Pagination
        currentPage={6}
        totalItems={120}
        itemsPerPage={10}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getAllByText('...')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Page 6' })).toHaveAttribute('aria-current', 'page');
  });
});
