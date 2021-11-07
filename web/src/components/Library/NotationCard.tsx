import { Avatar, Card, Divider, Skeleton, Tag } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import { ago } from '../../util/ago';
import { getQueryMatches } from './getQueryMatches';
import { NotationPreview } from './types';

const SKELETON_HEIGHT_PX = 400;
const HIGHLIGHT_COLOR = theme['@highlight-color'];
const THUMBNAIL_PLACEHOLDER = 'https://dpwvs3j3j2uwp.cloudfront.net/thumbnail_placeholder.jpg';

const Cover = styled.div`
  width: 100%;

  .ant-skeleton-element {
    width: 100%;
  }
`;

const Img = styled.img<{ $loading: boolean }>`
  width: ${(props) => (props.$loading ? '0%' : '100%')};
`;

const ColoredSpan = styled.span`
  color: ${HIGHLIGHT_COLOR};
`;

const Tags = styled.div`
  margin-top: 8px;
`;

const StyledCard = styled(Card)`
  border: 0;
`;

interface Props {
  notation: NotationPreview;
  query: string;
  isTagChecked: (tagId: string) => boolean;
}

export const NotationCard: React.FC<Props> = (props) => {
  const now = new Date();

  const { thumbnailUrl, songName, transcriber, artistName, tags } = props.notation;
  const url = thumbnailUrl || THUMBNAIL_PLACEHOLDER;

  const [thumbnailLoading, setThumbnailLoading] = useState(true);

  const onThumbnailLoad = () => {
    setThumbnailLoading(false);
  };

  return (
    <StyledCard
      hoverable
      cover={
        <Cover>
          {thumbnailLoading && <Skeleton.Image style={{ width: '100%', height: SKELETON_HEIGHT_PX }} />}
          <Img $loading={thumbnailLoading} onLoad={onThumbnailLoad} src={url} alt={songName} />
        </Cover>
      }
    >
      <Skeleton avatar active loading={thumbnailLoading} paragraph={{ rows: 1 }}>
        <Card.Meta
          avatar={transcriber.avatarUrl ? <Avatar src={transcriber.avatarUrl} /> : <Avatar />}
          title={
            <span>
              {getQueryMatches(props.query, transcriber.username).map((queryMatch) =>
                queryMatch.matches ? (
                  <ColoredSpan key={queryMatch.str}>{queryMatch.str}</ColoredSpan>
                ) : (
                  <span key={queryMatch.str}>{queryMatch.str}</span>
                )
              )}
            </span>
          }
          description={
            <>
              <div>
                <span>
                  {getQueryMatches(props.query, songName).map((queryMatch) =>
                    queryMatch.matches ? (
                      <ColoredSpan key={queryMatch.str}>{queryMatch.str}</ColoredSpan>
                    ) : (
                      <span key={queryMatch.str}>{queryMatch.str}</span>
                    )
                  )}
                </span>
                <Divider type="vertical" />
                <small>
                  {getQueryMatches(props.query, artistName).map((queryMatch) =>
                    queryMatch.matches ? (
                      <ColoredSpan key={queryMatch.str}>{queryMatch.str}</ColoredSpan>
                    ) : (
                      <span key={queryMatch.str}>{queryMatch.str}</span>
                    )
                  )}
                </small>
              </div>
              <small>{ago(new Date(props.notation.createdAt), now)}</small>
              <Tags>
                {tags.map((tag) => {
                  const isTagChecked = props.isTagChecked(tag.id);
                  const color = isTagChecked ? HIGHLIGHT_COLOR : undefined;
                  return (
                    <Tag key={tag.id} color={color}>
                      {tag.name}
                    </Tag>
                  );
                })}
              </Tags>
            </>
          }
        />
      </Skeleton>
    </StyledCard>
  );
};
