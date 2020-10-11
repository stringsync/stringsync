import React from 'react';
import { randStr } from '@stringsync/common';
import { UserRole } from '@stringsync/domain';
import { NotationList } from './NotationList';
import { render } from '@testing-library/react';
import { NotationPreview } from '../../../store/library/types';
import { Test } from '../../../testing';

it('renders without crashing', async () => {
  const nowStr = new Date().toString();
  const notations: NotationPreview[] = [
    {
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
    },
  ];
  const loadNextPage = jest.fn();
  const isTagChecked = () => true;
  const query = '';
  const shouldLoadMore = false;

  const { container } = render(
    <Test>
      <NotationList
        grid={{}}
        isPending={false}
        query={query}
        notations={notations}
        loadNextPage={loadNextPage}
        shouldLoadMore={shouldLoadMore}
        isTagChecked={isTagChecked}
      />
    </Test>
  );

  expect(container).toBeInTheDocument();
});
