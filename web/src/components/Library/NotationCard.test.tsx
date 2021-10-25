import { render } from '@testing-library/react';
import React from 'react';
import * as rand from '../../util/rand';
import { NotationCard } from './NotationCard';
import { NotationPreview } from './types';

describe('NotationCard', () => {
  it('runs without crashing', async () => {
    const transcriber = rand.user();
    const notation = rand.notation();
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
