import * as React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { IStore, IVideoState } from '../../@types/store';
import { connect } from 'react-redux';
import { IPlayer, PlayerStates, IYTEvent, IYTStateChangeEvent } from '../../@types/youtube';
import { VideoActions } from '../../data/video/videoActions';
import YouTube from 'react-youtube';

interface IOuterProps {
  src: string;
  kind: string;
}

interface IConnectProps {
  setPlayer: (player: IPlayer) => void;
  setPlayerState: (playerState: PlayerStates) => void;
  setVideo: (video: IVideoState) => void;
  resetVideo: () => void;
}

interface IHandlerProps {
  handleReady: (event: IYTEvent) => void;
  handleStateChange: (event: IYTStateChangeEvent) => void;
}

type InnerProps = IOuterProps & IConnectProps & IHandlerProps;

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
  connect<{}, IConnectProps, {}, {}>(
    null,
    dispatch => ({
      setPlayer: (player: IPlayer) => dispatch(VideoActions.setPlayer(player)),
      setPlayerState: (playerState: PlayerStates) => dispatch(VideoActions.setPlayerState(playerState)),
      setVideo: (video: IVideoState) => dispatch(VideoActions.setVideo(video)),
      resetVideo: () => dispatch(VideoActions.resetVideo())
    })
  ),
  lifecycle<IConnectProps, {}, {}>({
    componentDidMount(): void {
      this.props.resetVideo();
    },
    componentWillUnmount(): void {
      this.props.resetVideo();
    }
  }),
  withHandlers<IConnectProps, IHandlerProps>({
    handleReady: props => event => {
      props.setPlayer(event.target);
    },
    handleStateChange: props => event => {
      props.setPlayerState(PLAYER_STATES[event.data]);
    }
  })
);

export const Video = enhance(props => (
  <YouTube
    opts={DEFAULT_YOUTUBE_OPTIONS}
    videoId={props.src}
    onReady={props.handleReady}
    onStateChange={props.handleStateChange}
  />
));
