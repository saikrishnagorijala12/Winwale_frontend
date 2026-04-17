import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <ConfirmationModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Client"
        message="Are you sure?"
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders content, details, and warning when open', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete Client"
        message="Are you sure?"
        details={[{ label: 'Client', value: 'Acme Corp' }]}
        warning={{ message: 'This cannot be undone.', type: 'rose' }}
      />
    );

    expect(screen.getByText('Delete Client')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Client:')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('calls close and confirm handlers from the action buttons', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmationModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Archive"
        message="Continue?"
        confirmText="Yes"
        cancelText="No"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
