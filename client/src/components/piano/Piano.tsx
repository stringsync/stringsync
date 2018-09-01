import * as React from 'react';
import styled from 'react-emotion';
import { PianoKeys } from './';
import { PianoController } from './PianoController';
import { compose, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';

interface IInnerProps {
  isPianoVisible: boolean;
}

const enhance = compose(
  connect(
    (state: Store.IState) => ({
      isPianoVisible: state.ui.isPianoVisible
    })
  ),
  branch<IInnerProps>(
    props => !props.isPianoVisible,
    renderNothing
  )
);

const Outer = styled('div')`
  background: black;
  overflow-y: hidden;

  ::-webkit-scrollbar { 
    display: none; 
  }
`;

export const Piano = enhance(() => (
  <Outer>
    <PianoController />
    <PianoKeys />
  </Outer>
));
