import * as React from 'react';
import { compose, mapProps } from 'recompose';
import styled from 'react-emotion';

interface IOuterProps {
  songName?: string;
  artistName?: string;
  transcriberName?: string;
}

interface IInnerProps {
  line1: string;
  line2: string;
}

const enhance = compose<IInnerProps, IOuterProps>(
  mapProps((props: IOuterProps) => {
    const { songName, artistName, transcriberName } = props;

    return {
      line1: songName && artistName ? `${songName} by ${artistName}` : 'loading...',
      line2: transcriberName ? `transcribed by ${transcriberName}` : ''
    }
  })
);

const Outer = styled('div')`
  text-align: center;
  margin: 24px;
`

const Line1 = styled('h2')`
  color: black;
  font-weight: 500;
  font-size: 24px;
`;

const Line2 = styled('h4')`
  color: darkgray;
`;

export const Title = enhance(props => (
  <Outer>
    <Line1>{props.line1}</Line1>
    <Line2>{props.line2}</Line2>
  </Outer>
));
