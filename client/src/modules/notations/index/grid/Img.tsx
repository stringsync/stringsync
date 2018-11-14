import * as React from 'react';
import styled from 'react-emotion';
import { Skeleton } from 'antd';
import { compose, lifecycle } from 'recompose';
import { Transition } from 'react-transition-group';

const DURATION_MS = 150;

interface IProps {
  src: string;
  alt: string;
  loading: boolean;
  onLoad: () => void;
}

const enhance = compose<IProps, IProps>(
  lifecycle<IProps, {}, {}>({
    componentDidMount(): void {
      // preload image
      const img = new Image();
      img.onload = this.props.onLoad;
      img.src = this.props.src;
    }
  })
);

const Outer = styled('div')<{ loading: boolean }>`
  padding: ${props => props.loading ? 24 : 0}px;
`;

const StyledImg = styled('img')`
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity ${DURATION_MS}ms ease-in-out;
`;

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

/**
 * This component will conditionally show the placeholder until
 * the image loads. This avoids showing abrupt animations when
 * the image is loading.
 */
export const Img = enhance((props => (
  <Outer loading={props.loading}>
    <Transition in={!props.loading} timeout={DURATION_MS}>
      {state => (
        <Skeleton
          active={true}
          loading={props.loading}
          paragraph={{ rows: 7 }}
        >
          <StyledImg src={props.src} alt={props.alt} style={{ ...transitionStyles[state] }} />
        </Skeleton>
      )}
    </Transition>
  </Outer>
)));
