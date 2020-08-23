import { List } from 'antd';
import { ListGridType } from 'antd/lib/list';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NotationPreview } from '../../../store/library/types';
import { NotationCard } from './NotationCard';
import { Link } from 'react-router-dom';

interface Props {
  isPending: boolean;
  notations: NotationPreview[];
  hasNextPage: boolean;
  query: string;
  grid: ListGridType;
  loadNextPage: (pageNumber: number) => void;
  isTagChecked: (tagId: string) => boolean;
}

export const NotationList: React.FC<Props> = (props) => {
  return (
    <div data-testid="notation-list">
      {!props.notations.length && props.isPending ? null : (
        <InfiniteScroll initialLoad={false} loadMore={props.loadNextPage} hasMore={props.hasNextPage}>
          <List
            grid={props.grid}
            dataSource={props.notations}
            renderItem={(notation) => (
              <List.Item>
                <Link to={`/n/${notation.id}`}>
                  <NotationCard notation={notation} query={props.query} isTagChecked={props.isTagChecked} />
                </Link>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      )}
    </div>
  );
};
