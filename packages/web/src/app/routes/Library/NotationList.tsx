import { List } from 'antd';
import { ListGridType } from 'antd/lib/list';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NotationPreview } from '../../../store/library/types';
import { NotationCard } from './NotationCard';
import { Link } from 'react-router-dom';

const MemoizedNotationCard = React.memo(
  NotationCard,
  (prevProps, nextProps) =>
    prevProps.notation.id === nextProps.notation.id &&
    prevProps.query === nextProps.query &&
    prevProps.isTagChecked === nextProps.isTagChecked
);

interface Props {
  isPending: boolean;
  notations: NotationPreview[];
  shouldLoadMore: boolean;
  query: string;
  grid: ListGridType;
  loadNextPage: (pageNumber: number) => void;
  isTagChecked: (tagId: string) => boolean;
}

export const NotationList: React.FC<Props> = (props) => {
  return (
    <InfiniteScroll
      data-testid="notation-list"
      threshold={20}
      loadMore={props.loadNextPage}
      hasMore={props.shouldLoadMore}
    >
      {!props.notations.length && props.isPending ? null : (
        <List
          grid={props.grid}
          dataSource={props.notations}
          rowKey={(notation) => notation.id}
          renderItem={(notation) => (
            <List.Item key={notation.id}>
              <Link to={`/n/${notation.id}`}>
                <MemoizedNotationCard notation={notation} query={props.query} isTagChecked={props.isTagChecked} />
              </Link>
            </List.Item>
          )}
        />
      )}
    </InfiniteScroll>
  );
};
