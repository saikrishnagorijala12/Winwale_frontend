import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductsTable from './ProductsTable';
import { MemoryRouter } from 'react-router-dom';

describe('ProductsTable', () => {
  const defaultProps = {
    products: [],
    totalItems: 0,
    loading: false,
    selectedClient: null,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    startIndex: 0,
    onProductClick: vi.fn(),
    onPageChange: vi.fn()
  };

  it('renders loading state correctly', () => {
    render(<MemoryRouter><ProductsTable {...defaultProps} loading={true} /></MemoryRouter>);
    expect(screen.getByText('Loading Products...')).toBeInTheDocument();
  });

  it('renders empty state correctly when no products', () => {
    render(<MemoryRouter><ProductsTable {...defaultProps} products={[]} /></MemoryRouter>);
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('renders products when provided', () => {
    const products = [
      {
        product_id: 1,
        item_description: 'Test Item',
        product_type: 'Software',
        client_id: 1,
        manufacturer: 'Acme',
        mfr_part_number: 'P-123',
        price: '100.00',
        uom: 'EA',
        client: 'Client A'
      }
    ] as any;
    
    render(<MemoryRouter><ProductsTable {...defaultProps} products={products} /></MemoryRouter>);
    
    // Check if table headers are present
    expect(screen.getByText('Item Description')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer')).toBeInTheDocument();
  });
});
