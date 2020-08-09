import React from 'react';
import { randStr } from '@stringsync/common';
import { UserRole } from '@stringsync/domain';
import { NotationList } from './NotationList';
import { render } from '@testing-library/react';
import { NotationPreview } from '../store/library/types';

it('renders without crashing', async () => {
  const now = new Date();
  const notations: NotationPreview[] = [
    {
      id: randStr(8),
      artistName: randStr(10),
      createdAt: now,
      updatedAt: now,
      songName: randStr(10),
      thumbnailUrl: randStr(10),
      tags: [],
      transcriber: {
        id: randStr(8),
        avatarUrl: randStr(10),
        role: UserRole.TEACHER,
        username: randStr(8),
      },
    },
  ];
  const loadMore = jest.fn();
  const hasNextPage = false;

  const { container } = render(<NotationList notations={notations} loadMore={loadMore} hasNextPage={hasNextPage} />);

  expect(container).toBeInTheDocument();
});
