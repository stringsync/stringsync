import { List } from 'antd';
import { ListGridType } from 'antd/lib/list';
import React, { useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NotationPreview } from '../../../store/library/types';
import { NotationCard } from './NotationCard';
import { sortBy } from 'lodash';

interface Props {
  notations: NotationPreview[];
  loadMore: (pageNumber: number) => void;
  hasNextPage: boolean;
  grid?: ListGridType;
}

export const NotationList: React.FC<Props> = (props) => {
  const notations = useMemo(() => sortBy(props.notations, (notation) => -new Date(notation.createdAt).getTime()), [
    props.notations,
  ]);
  return (
    <div data-testid="notation-list">
      <InfiniteScroll initialLoad={false} loadMore={props.loadMore} hasMore={props.hasNextPage}>
        <List
          grid={props.grid}
          dataSource={notations}
          renderItem={(notation) => (
            <List.Item>
              <NotationCard notation={notation} />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};
