import { List, Card, Divider, Tag, Avatar } from 'antd';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NotationPreview } from '../../store/library/types';
import { ListGridType } from 'antd/lib/list';
import styled from 'styled-components';

const Tags = styled.div`
  margin-top: 8px;
`;

interface Props {
  notations: NotationPreview[];
  loadMore: (pageNumber: number) => void;
  hasNextPage: boolean;
  grid?: ListGridType;
}

export const NotationList: React.FC<Props> = (props) => {
  return (
    <div data-testid="notation-list">
      <InfiniteScroll initialLoad={true} loadMore={props.loadMore} hasMore={props.hasNextPage}>
        <List
          grid={props.grid}
          dataSource={props.notations}
          renderItem={(notation) => (
            <List.Item>
              <Card cover={notation.thumbnailUrl ? <img src={notation.thumbnailUrl} alt={notation.songName} /> : null}>
                <Card.Meta
                  avatar={notation.transcriber.avatarUrl ? <Avatar src={notation.transcriber.avatarUrl} /> : <Avatar />}
                  title={notation.transcriber.username}
                  description={
                    <>
                      <div>
                        <span>{notation.songName}</span>
                        <Divider type="vertical" />
                        <small>{notation.artistName}</small>
                      </div>
                      <Tags>
                        {notation.tags.map((tag) => (
                          <Tag key={tag.id}>{tag.name}</Tag>
                        ))}
                      </Tags>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};
