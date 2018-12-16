import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import styled from 'react-emotion';

interface IProps {
  songName: string | void;
  artistName: string | void;
  transcriberName: string | void;
}

const Loading = () => <Outer><StyledH1>loading...</StyledH1></Outer>;

const enhance = compose<IProps, IProps>(
  branch<IProps>(
    props => !props.songName || !props.artistName || !props.transcriberName,
    renderComponent(Loading)
  )
);

const Outer = styled('div')`
  text-align: center;
`;

const StyledH1 = styled('h1')`
  font-size: 2em;
  margin-bottom: 0.2em;
`;

const StyledH2 = styled('h2')`
  font-size: 1.25em;
  color: #aaaaaa;
`;

export const Title = enhance(props => (
  <Outer>
    <StyledH1>{props.songName} by {props.artistName}</StyledH1>
    <StyledH2>transcribed by {props.transcriberName}</StyledH2>
  </Outer>
));
