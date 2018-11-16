import * as React from 'react';
import styled from 'react-emotion';
import { Logo } from '../branding';
import { compose, branch, renderNothing, withState, withHandlers } from 'recompose';
import { Transition } from 'react-transition-group';

const DURATION_MS = 500;

interface IProps {
  loading: boolean;
}

interface IStateProps extends IProps {
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

interface IHandlerProps extends IStateProps {
  triggerLoaded: () => void;
}

const enhance = compose<IHandlerProps, IProps>(
  withState('loaded', 'setLoaded', false),
  withHandlers<IStateProps, any>({
    triggerLoaded: props => () => {
      props.setLoaded(true);
    }
  }),
  branch<IHandlerProps>(
    props => !props.loading && props.loaded,
    renderNothing
  )
);

const getOpacity = (state: string) => {
  switch (state) {
    case 'entered':
      return 1;
    case 'exiting':
      return 0;
    default:
      return 1;
  }
};

const Mask = styled('div') <{ state: string }>`
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  opacity: ${({ state }) => getOpacity(state)};
  transition: opacity ${DURATION_MS}ms ease-in-out;
`;

export const Loading = enhance(props => (
  <Transition
    in={props.loading}
    timeout={DURATION_MS}
    onExited={props.triggerLoaded}
  >
    {state => <Mask state={state}><Logo size={64} /></Mask>}
  </Transition>
));
