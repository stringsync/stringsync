import { Avatar, Card, Divider, Skeleton, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useEffectOnce } from '../../../hooks';
import { NotationPreview } from '../../../store/library/types';
import { theme } from '../../../theme';
import { getQueryMatches } from './getQueryMatches';

const LOAD_TIMEOUT_MS = 3000;

const HIGHLIGHT_COLOR = theme['@highlight-color'];

const ColoredSpan = styled.span`
  color: ${HIGHLIGHT_COLOR};
`;

const Tags = styled.div`
  margin-top: 8px;
`;

const StyledSkeleton = styled(Skeleton)`
  padding: ${(props) => (props.loading ? 24 : 0)}px;
`;

interface Props {
  notation: NotationPreview;
  query: string;
  isTagChecked: (tagId: string) => boolean;
}

export const NotationCard: React.FC<Props> = (props) => {
  const { thumbnailUrl, songName, transcriber, artistName, tags } = props.notation;

  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const loading = thumbnailLoading || avatarLoading;

  const thumbnailImg = useRef(new Image());
  const avatarImg = useRef(new Image());

  const onThumbnailLoad = () => {
    setThumbnailLoading(false);
  };

  const onAvatarLoad = () => {
    setAvatarLoading(false);
  };

  useEffectOnce(() => {
    if (thumbnailUrl) {
      const img = thumbnailImg.current;
      img.onload = onThumbnailLoad;
      img.src = thumbnailUrl;
      setTimeout(onThumbnailLoad, LOAD_TIMEOUT_MS);
    } else {
      setThumbnailLoading(false);
    }
  });

  useEffectOnce(() => {
    if (transcriber.avatarUrl) {
      const img = avatarImg.current;
      img.onload = onAvatarLoad;
      img.src = transcriber.avatarUrl;
      setTimeout(onAvatarLoad, LOAD_TIMEOUT_MS);
    } else {
      setAvatarLoading(false);
    }
  });

  return (
    <Card
      hoverable
      cover={
        <StyledSkeleton active loading={loading} paragraph={{ rows: 7 }}>
          {thumbnailUrl ? <img src={thumbnailUrl} alt={songName} /> : null}
        </StyledSkeleton>
      }
    >
      <Skeleton avatar active loading={loading} paragraph={{ rows: 1 }}>
        <Card.Meta
          avatar={transcriber.avatarUrl ? <Avatar src={transcriber.avatarUrl} /> : <Avatar />}
          title={
            <span>
              {getQueryMatches(props.query, transcriber.username).map((queryMatch) =>
                queryMatch.matches ? <ColoredSpan>{queryMatch.str}</ColoredSpan> : <span>{queryMatch.str}</span>
              )}
            </span>
          }
          description={
            <>
              <div>
                <span>
                  {getQueryMatches(props.query, songName).map((queryMatch) =>
                    queryMatch.matches ? <ColoredSpan>{queryMatch.str}</ColoredSpan> : <span>{queryMatch.str}</span>
                  )}
                </span>
                <Divider type="vertical" />
                <small>
                  {getQueryMatches(props.query, artistName).map((queryMatch) =>
                    queryMatch.matches ? <ColoredSpan>{queryMatch.str}</ColoredSpan> : <span>{queryMatch.str}</span>
                  )}
                </small>
              </div>
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
    </Card>
  );
};
