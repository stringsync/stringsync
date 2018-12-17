import * as React from 'react';
import { Overlap } from '../overlap/Overlap';
import woodTextureSrc from '../../assets/wood-texture.jpg';
import styled from 'react-emotion';
import { Layer } from '../overlap';
import { Frets } from './fret/Frets';
import { GuitarStrings } from './guitar-strings';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Fretboard as FretboardModel } from '../../models/fretboard';
import { IStore } from '../../@types/store';
import { ScoreActions } from '../../data/score';

interface IProps {
  numFrets: number;
}

interface IDispatchProps {
  setFretboard: (fretboard: FretboardModel | null) => void;
}

type InnerProps = IProps & IDispatchProps;

const enhance = compose<InnerProps, IProps>(
  connect<{}, IDispatchProps, {}, IStore>(
    null,
    dispatch => ({
      setFretboard: (fretboard: FretboardModel | null) => dispatch(ScoreActions.setFretboard(fretboard))
    })
  ),
  lifecycle<InnerProps, {}, {}>({
    componentDidMount(): void {
      this.props.setFretboard(new FretboardModel());
    },
    componentWillUnmount(): void {
      this.props.setFretboard(null);
    }
  })
);

const Outer = styled('div')`
  background: url(${woodTextureSrc});
  background-color: black;
  width: 100%;

  &, .fretboard-height {
    height: 200px;
  }
`;

export const Fretboard = enhance(props => (
  <Outer>
    <Overlap>
      <Layer>
        <Frets numFrets={props.numFrets} />
      </Layer>
      <Layer>
        <GuitarStrings />
      </Layer>
    </Overlap>
  </Outer>
));
