import { Skeleton } from 'antd';
import styled from 'styled-components';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';
import { Tags } from './Tags';

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0;
`;

const Subtitle = styled.h2`
  text-align: center;
  margin-bottom: 0;
`;

const Muted = styled.h3`
  text-align: center;
  color: ${(props) => props.theme['@muted']};
`;

type Props = {
  skeleton: boolean;
  notation: Nullable<notations.RenderableNotation>;
};

export const Info: React.FC<Props> = (props) => {
  const notation = props.notation;
  const songName = notation?.songName || '???';
  const artistName = notation?.artistName || '???';
  const transcriberUsername = notation?.transcriber.username || '???';

  return (
    <Skeleton title loading={props.skeleton}>
      <Title>{songName}</Title>
      <Subtitle>by {artistName}</Subtitle>
      <Muted>{transcriberUsername}</Muted>
      <Tags tags={notation?.tags || []} />
    </Skeleton>
  );
};
