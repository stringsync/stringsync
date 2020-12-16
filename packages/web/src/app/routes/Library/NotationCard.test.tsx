import { randStr } from '@stringsync/common';
import { UserRole } from '@stringsync/domain';
import { render } from '@testing-library/react';
import React from 'react';
import { NotationCard } from './NotationCard';

describe('NotationCard', () => {
  it('runs without crashing', async () => {
    const nowStr = new Date().toString();
    const notation = {
      id: randStr(8),
      artistName: randStr(10),
      createdAt: nowStr,
      updatedAt: nowStr,
      songName: randStr(10),
      thumbnailUrl: randStr(10),
      tags: [],
      transcriber: {
        id: randStr(8),
        avatarUrl: randStr(10),
        role: UserRole.TEACHER,
        username: randStr(8),
      },
    };
    const isTagChecked = () => true;
    const query = '';

    const { container } = render(<NotationCard notation={notation} query={query} isTagChecked={isTagChecked} />);

    expect(container).toBeInTheDocument();
  });
});
