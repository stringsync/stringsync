import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { Fretboard } from '../../../components/fretboard';

interface IStateProps {
  fretboardVisible: boolean;
}

const enhance = compose(
  connect<IStateProps, {}, {}, IStore>(
    state => ({ fretboardVisible: state.notationMenu.fretboardVisible })
  ),
  branch<IStateProps>(
    props => !props.fretboardVisible,
    renderNothing
  )
);

export const FretboardWrapper = enhance(() => <Fretboard />);
