import { PageInfo } from '@stringsync/common';
import { List } from 'antd';
import { ListGridType } from 'antd/lib/list';
import { isEqual } from 'lodash';
import React, { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { getNotationPage } from '../../../store/library';
import { NotationPreview } from '../../../store/library/types';
import { NotationCard } from './NotationCard';

const PAGE_SIZE = 9;

const MemoizedNotationCard = React.memo(
  NotationCard,
  (prevProps, nextProps) =>
    prevProps.notation.id === nextProps.notation.id &&
    prevProps.query === nextProps.query &&
    prevProps.isTagChecked === nextProps.isTagChecked
);

interface Props {
  grid: ListGridType;
}

export const NotationList: React.FC<Props> = (props) => {
  // store state
  const dispatch = useDispatch<AppDispatch>();
  const query = useSelector<RootState, string>((state) => state.library.query);
  const tagIds = useSelector<RootState, string[]>((state) => state.library.tagIds, isEqual);
  const notations = useSelector<RootState, NotationPreview[]>((state) => state.library.notations);
  const pageInfo = useSelector<RootState, PageInfo>((state) => state.library.pageInfo);
  const isPending = useSelector<RootState, boolean>((state) => state.library.isPending);
  const hasErrors = useSelector<RootState, boolean>((state) => state.library.errors.length > 0);

  // computed state
  const shouldLoadMore = Boolean(pageInfo.hasNextPage) && !isPending && !hasErrors;
  const tagIdSet = new Set(tagIds);

  // callbacks
  const loadMore = useCallback(async () => {
    await dispatch(getNotationPage({ pageSize: PAGE_SIZE }));
  }, [dispatch]);

  const isTagChecked = useCallback((tagId) => tagIdSet.has(tagId), [tagIdSet]);

  return (
    <InfiniteScroll data-testid="notation-list" threshold={20} loadMore={loadMore} hasMore={shouldLoadMore}>
      <List
        grid={props.grid}
        dataSource={notations}
        rowKey={(notation) => notation.id}
        renderItem={(notation) => (
          <List.Item>
            <Link to={`/n/${notation.id}`}>
              <MemoizedNotationCard notation={notation} query={query} isTagChecked={isTagChecked} />
            </Link>
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
};
