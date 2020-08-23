import React, { useState, useRef, useCallback } from 'react';
import { NotationPreview } from '../store/library/types';
import { Card, Avatar, Divider, Skeleton, Tag } from 'antd';
import styled from 'styled-components';
import { useEffectOnce } from '../hooks';

const LOAD_TIMEOUT_MS = 5000;

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

  const [isImgLoading, setIsImgLoading] = useState(true);
  const imgRef = useRef(new Image());

  const onImgLoad = useCallback(() => {
    setIsImgLoading(false);
  }, []);

  useEffectOnce(() => {
    if (thumbnailUrl) {
      const img = imgRef.current;
      img.onload = onImgLoad;
      img.src = thumbnailUrl;
    } else {
      setIsImgLoading(false);
    }
  });

  return (
    <Card
      hoverable
      cover={
        <StyledSkeleton loading={isImgLoading} paragraph={{ rows: 7 }}>
          {thumbnailUrl ? <img src={thumbnailUrl} alt={songName} /> : null}
        </StyledSkeleton>
      }
    >
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
    </Card>
  );
};
