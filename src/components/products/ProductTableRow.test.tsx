import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProductTableRow from './ProductTableRow';

describe('ProductTableRow', () => {
  it('renders the current product fields and formatted price', () => {
    render(
      <table>
        <tbody>
          <ProductTableRow
            product={{
              product_id: 1,
              client_id: 2,
              client_name: 'Client A',
              item_type: 'A',
              item_name: 'Docking Station',
              item_description: 'USB-C dock',
              manufacturer: 'Acme',
              manufacturer_part_number: 'DOC-100',
              commercial_list_price: 129.5,
              uom: 'EA',
            }}
            onClick={vi.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Docking Station')).toBeInTheDocument();
    expect(screen.getByText('USB-C dock')).toBeInTheDocument();
    expect(screen.getByText('Accessory')).toBeInTheDocument();
    expect(screen.getByText('Client A')).toBeInTheDocument();
    expect(screen.getByText('DOC-100')).toBeInTheDocument();
    expect(screen.getByText('$129.50')).toBeInTheDocument();
  });

  it('invokes onClick when the row is clicked', () => {
    const onClick = vi.fn();

    render(
      <table>
        <tbody>
          <ProductTableRow
            product={{
              product_id: 2,
              client_id: 4,
              client_name: null,
              item_type: 'B',
              item_name: 'Laptop',
              manufacturer: 'Acme',
              manufacturer_part_number: 'LTP-200',
              commercial_list_price: 999,
              uom: 'EA',
            }}
            onClick={onClick}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('Laptop'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
