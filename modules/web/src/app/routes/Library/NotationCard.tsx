import React, { useState, useRef, useCallback } from 'react';
import { NotationPreview } from '../../../store/library/types';
import { Card, Avatar, Divider, Skeleton, Tag } from 'antd';
import styled from 'styled-components';
import { useEffectOnce } from '../../../hooks';

const LOAD_TIMEOUT_MS = 3000;

const Tags = styled.div`
  margin-top: 8px;
`;

const StyledSkeleton = styled(Skeleton)`
  padding: ${(props) => (props.loading ? 24 : 0)}px;
`;

interface Props {
  notation: NotationPreview;
}

export const NotationCard: React.FC<Props> = (props) => {
  const { thumbnailUrl, songName, transcriber, artistName, tags } = props.notation;

  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const loading = thumbnailLoading || avatarLoading;

  const thumbnailImg = useRef(new Image());
  const avatarImg = useRef(new Image());

  const onThumbnailLoad = useCallback(() => {
    setThumbnailLoading(false);
  }, []);

  const onAvatarLoad = useCallback(() => {
    setAvatarLoading(false);
  }, []);

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
          title={transcriber.username}
          description={
            <>
              <div>
                <span>{songName}</span>
                <Divider type="vertical" />
                <small>{artistName}</small>
              </div>
              <Tags>
                {tags.map((tag) => (
                  <Tag key={tag.id}>{tag.name}</Tag>
                ))}
              </Tags>
            </>
          }
        />
      </Skeleton>
    </Card>
  );
};
