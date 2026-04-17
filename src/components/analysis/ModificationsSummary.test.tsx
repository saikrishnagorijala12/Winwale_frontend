import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ModificationsSummary from './ModificationsSummary';

describe('ModificationsSummary', () => {
  it('renders each non-zero modification count', () => {
    render(
      <ModificationsSummary
        hasModifications={true}
        summary={{
          additions: 1,
          deletions: 2,
          priceIncreases: 3,
          priceDecreases: 4,
          descriptionChanges: 5,
          noChanges: 6,
        }}
      />
    );

    ['1', '2', '3', '4', '5', '6'].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('shows the empty fallback when nothing changed', () => {
    render(
      <ModificationsSummary
        hasModifications={false}
        summary={{
          additions: 0,
          deletions: 0,
          priceIncreases: 0,
          priceDecreases: 0,
          descriptionChanges: 0,
          noChanges: 0,
        }}
      />
    );

    expect(screen.getByText('No modifications')).toBeInTheDocument();
  });
});
