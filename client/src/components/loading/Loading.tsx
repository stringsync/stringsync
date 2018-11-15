import * as React from 'react';
import styled from 'react-emotion';
import { Logo } from '../branding';
import { compose, branch, renderNothing } from 'recompose';
import { Transition } from 'react-transition-group';

const DURATION_MS = 200;

interface IProps {
  loading: boolean;
}

const enhance = compose<IProps, IProps>(
  branch<IProps>(props => !props.loading, renderNothing)
);

const Outer = styled('div')`
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
`;

export const Loading = enhance(props => (
  <Outer>
    <Transition
      in={!props.loading}
      timeout={DURATION_MS}
    >
      <Logo size={64} />
    </Transition>
  </Outer>
));
