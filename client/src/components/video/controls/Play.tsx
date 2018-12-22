import * as React from 'react';
import { Row, Icon } from 'antd';
import styled from 'react-emotion';
import { ICON_SIZE } from './ICON_SIZE';
import { compose, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { IPlayer } from '../../../@types/youtube';
import { IStore } from '../../../@types/store';

interface IStateProps {
  isVideoActive: boolean | void;
  videoPlayer: IPlayer | null | undefined;
}

interface IHandlerProps {
  handleClick: () => void;
}

interface IWithProps {
  iconType: 'play-circle' | 'pause-circle';
}

type InnerProps = IStateProps & IHandlerProps & IWithProps;

const enhance = compose <InnerProps, {}>(
  connect<IStateProps, {}, {}, IStore>(
    state => ({
      isVideoActive: state.video.isActive,
      videoPlayer: state.video.player
    })
  ),
  withHandlers<IStateProps, IHandlerProps>({
    handleClick: props => () => {
      if (!props.videoPlayer) {
        return;
      }

      if (props.isVideoActive) {
        props.videoPlayer.pauseVideo();
      } else {
        props.videoPlayer.playVideo();
      }
    }
  }),
  withProps<IWithProps, IStateProps & IHandlerProps>(props => ({
    iconType: props.isVideoActive ? 'pause-circle' : 'play-circle'
  }))
);

const Outer = styled('div')`
  cursor: pointer;
`;

export const Play = enhance(props => (
  <Outer onClick={props.handleClick}>
    <Row
      type="flex"
      justify="center"
      align="middle"
    >
      <Icon type={props.iconType} style={{ fontSize: ICON_SIZE }} />
    </Row>
  </Outer>
));
