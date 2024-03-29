import styled from 'styled-components';
import * as notations from '../lib/notations';
import { Nullable } from '../util/types';
import { Tags } from './Tags';

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0;
  font-size: 2em;
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
  notation: Nullable<notations.RenderableNotation>;
};

export const NotationInfo: React.FC<Props> = (props) => {
  const notation = props.notation;
  const songName = notation?.songName || '???';
  const artistName = notation?.artistName || '???';
  const transcriberUsername = notation?.transcriber.username || '???';

  return (
    <div data-testid="notation-info">
      <Title>{songName}</Title>
      <Subtitle>by {artistName}</Subtitle>
      <Muted>{transcriberUsername}</Muted>
      <Tags tags={notation?.tags || []} />
    </div>
  );
};
