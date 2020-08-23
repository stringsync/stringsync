import { List } from 'antd';
import { ListGridType } from 'antd/lib/list';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NotationPreview } from '../store/library/types';
import { NotationCard } from './NotationCard';

interface Props {
  notations: NotationPreview[];
  loadMore: (pageNumber: number) => void;
  hasNextPage: boolean;
  grid?: ListGridType;
}

export const NotationList: React.FC<Props> = (props) => {
  return (
    <div data-testid="notation-list">
      <InfiniteScroll initialLoad={false} loadMore={props.loadMore} hasMore={props.hasNextPage}>
        <List
          grid={props.grid}
          dataSource={props.notations}
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
