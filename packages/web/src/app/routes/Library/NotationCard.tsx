import { Avatar, Card, Divider, Skeleton, Tag } from 'antd';
import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';
import styled from 'styled-components';
import { NotationPreview } from '../../../store/library/types';
import { theme } from '../../../theme';
import { getQueryMatches } from './getQueryMatches';

const FADE_IN_DURATION_MS = 300;

const HIGHLIGHT_COLOR = theme['@highlight-color'];

const getOpacity = (state: TransitionStatus) => {
  switch (state) {
    case 'entering':
      return 0;
    case 'entered':
      return 1;
    default:
      return 0;
  }
};

const ColoredSpan = styled.span`
  color: ${HIGHLIGHT_COLOR};
`;

const Tags = styled.div`
  margin-top: 8px;
`;

const StyledImg = styled.img<{ state: TransitionStatus }>`
  opacity: ${({ state }) => getOpacity(state)};
  transition: opacity ${FADE_IN_DURATION_MS}ms ease-in-out;
`;

interface Props {
  notation: NotationPreview;
  query: string;
  isTagChecked: (tagId: string) => boolean;
}

export const NotationCard: React.FC<Props> = (props) => {
  const { thumbnailUrl, songName, transcriber, artistName, tags } = props.notation;

  const [thumbnailLoading, setThumbnailLoading] = useState(true);

  const onThumbnailLoad = () => {
    setThumbnailLoading(false);
  };

  return (
    <Card
      hoverable
      cover={
        thumbnailUrl && (
          <Transition appear in={!thumbnailLoading} timeout={FADE_IN_DURATION_MS}>
            {(state) => <StyledImg onLoad={onThumbnailLoad} state={state} src={thumbnailUrl} alt={songName} />}
          </Transition>
        )
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
