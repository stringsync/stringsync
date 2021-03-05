import { render } from '@testing-library/react';
import React from 'react';
import { buildRandNotation, buildRandUser } from '../../../testing';
import { NotationCard } from './NotationCard';
import { NotationPreview } from './types';

describe('NotationCard', () => {
  it('runs without crashing', async () => {
    const transcriber = buildRandUser();
    const notation = buildRandNotation();
    const notationPreview: NotationPreview = {
      ...notation,
      transcriber,
      tags: [],
      createdAt: notation.createdAt.toISOString(),
      updatedAt: notation.updatedAt.toISOString(),
    };
    const isTagChecked = () => true;
    const query = '';

    const { container } = render(<NotationCard notation={notationPreview} query={query} isTagChecked={isTagChecked} />);

    expect(container).toBeInTheDocument();
  });
});
