import * as React from 'react';
import { compose, lifecycle, withHandlers, branch, renderNothing } from 'recompose';
import { IVideoState } from '../../@types/store';
import { connect } from 'react-redux';
import { IPlayer, PlayerStates, IYTEvent, IYTStateChangeEvent } from '../../@types/youtube';
import { VideoActions } from '../../data/video/videoActions';
import YouTube from 'react-youtube';
import styled from 'react-emotion';
import { TimeSync } from './TimeSync';

interface IOuterProps {
  src: string;
  kind: string;
  onReady?: (event?: IYTEvent) => void;
}

interface IDispatchProps {
  setPlayer: (player: IPlayer) => void;
  setPlayerState: (playerState: PlayerStates) => void;
  setVideo: (video: IVideoState) => void;
  resetVideo: () => void;
}

interface IHandlerProps {
  handleReady: (event: IYTEvent) => void;
  handleStateChange: (event: IYTStateChangeEvent) => void;
}

type InnerProps = IOuterProps & IDispatchProps & IHandlerProps;

const PLAYER_STATES = Object.freeze({
  '-1': 'UNSTARTED',
  '0': 'ENDED',
  '1': 'PLAYING',
  '2': 'PAUSED',
  '3': 'BUFFERING',
  '5': 'VIDEO_CUED'
});

const DEFAULT_YOUTUBE_OPTIONS = Object.freeze({
  playerVars: {
    disablekb: 1,
    fs: 0,
    loop: 1,
    modestbranding: 1,
    playsinline: 1,
    rel: 0,
    showinfo: 0,
    start: 0,
  }
});

const enhance = compose<InnerProps, IOuterProps>(
  connect<{}, IDispatchProps>(
    null,
    dispatch => ({
      setPlayer: (player: IPlayer) => dispatch(VideoActions.setPlayer(player)),
      setPlayerState: (playerState: PlayerStates) => dispatch(VideoActions.setPlayerState(playerState)),
      setVideo: (video: IVideoState) => dispatch(VideoActions.setVideo(video)),
      resetVideo: () => dispatch(VideoActions.resetVideo())
    })
  ),
  branch<IDispatchProps & IOuterProps>(
    props => !props.src,
    renderNothing
  ),
  lifecycle<IDispatchProps & IOuterProps, {}, {}>({
    componentDidMount(): void {
      const { kind, src } = this.props;
      const player = null;
      const currentTimeMs = 0;
      this.props.setVideo({ kind, src, player, currentTimeMs });
    },
    componentWillUnmount(): void {
      this.props.resetVideo();
    }
  }),
  withHandlers<IDispatchProps & IOuterProps, IHandlerProps>({
    handleReady: props => event => {
      props.setPlayer(event.target);

      if (typeof props.onReady === 'function') {
        props.onReady(event);
      }
    },
    handleStateChange: props => event => {
      props.setPlayerState(PLAYER_STATES[event.data]);
    }
  })
);

const Outer = styled('div')`
  background: black;
`;

export const Video = enhance(props => (
  <Outer>
    <TimeSync />
    <YouTube
      opts={DEFAULT_YOUTUBE_OPTIONS}
      videoId={props.src}
      onReady={props.handleReady}
      onStateChange={props.handleStateChange}
    />
  </Outer>
));
