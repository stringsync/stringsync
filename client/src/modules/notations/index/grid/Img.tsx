import * as React from 'react';
import styled from 'react-emotion';
import { Skeleton } from 'antd';
import { compose, lifecycle, withState } from 'recompose';
import { Transition } from 'react-transition-group';

const DURATION_MS = 150;

interface IProps {
  src: string;
  alt: string;
  loading: boolean;
  onLoad: () => void;
}

interface IImgProps extends IProps {
  img: HTMLImageElement;
  setImg: (img: HTMLImageElement) => void;
}

const noop = () => null;

const enhance = compose<IImgProps, IProps>(
  withState('img', 'setImg', new Image()),
  lifecycle<IImgProps, {}, {}>({
    componentDidMount(): void {
      const img = new Image();
      this.props.setImg(img);
      img.onload = this.props.onLoad;
      img.src = this.props.src;
    },
    componentWillUnmount(): void {
      // prevent the img from executing a callback if unmounting
      this.props.img.onload = noop;
      this.props.img.src = '';
    }
  })
);

const Outer = styled('div')<{ loading: boolean }>`
  padding: ${props => props.loading ? 24 : 0}px;
`;

const getOpacity = (state: string) => {
  switch (state) {
    case 'entering':
      return 0;
    case 'entered':
      return 1;
    default:
      return 0;
  }
};

const StyledImg = styled('img')<{ state: string }>`
  width: 100%;
  height: 100%;
  opacity: ${({ state }) => getOpacity(state)};
  transition: opacity ${DURATION_MS}ms ease-in-out;
`;

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
          <StyledImg
            src={props.src}
            alt={props.alt}
            state={state}
          />
        </Skeleton>
      )}
    </Transition>
  </Outer>
)));
