import React from 'react';
import { render, screen } from '@testing-library/react';
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
        item_name: 'Test Item',
        item_description: 'Test item description',
        item_type: 'B',
        client_id: 1,
        client_name: 'Client A',
        manufacturer: 'Acme',
        manufacturer_part_number: 'P-123',
        commercial_list_price: 100,
        uom: 'EA',
      }
    ] as any;
    
    render(<MemoryRouter><ProductsTable {...defaultProps} products={products} /></MemoryRouter>);
    
    expect(screen.getByText('Item Description')).toBeInTheDocument();
    expect(screen.getByText('Manufacturer')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Client A')).toBeInTheDocument();
  });
});
