import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { VideoActions } from 'data';
import YouTube from 'react-youtube';
import { TimeSync } from './TimeSync';

interface IInnerProps {
  src: string;
  kind: Video.Kinds;
  setPlayer: (player: Youtube.IPlayer) => void;
  setPlayerState: (playerState: Youtube.PlayerStates) => void;
  handleReady: (event: Youtube.IEvent) => void;
  handleStateChange: (event: Youtube.IStateChangeEvent) => void;
}

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

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      kind: state.video.kind,
      src: state.video.src
    }),
    dispatch => ({
      setPlayer: (player: Youtube.IPlayer) => dispatch(VideoActions.setPlayer(player)),
      setPlayerState: (playerState: Youtube.PlayerStates) => dispatch(VideoActions.setPlayerState(playerState))
    })
  ),
  withHandlers({
    handleReady: (props: any) => (event: Youtube.IEvent) => {
      props.setPlayer(event.target);
    },
    handleStateChange: (props: any) => (event: Youtube.IStateChangeEvent) => {
      props.setPlayerState(PLAYER_STATES[event.data]);
    }
  })
);

/**
 * Wrapper around the YouTube (react-youtube) component
 */
export const Video = enhance(props => (
  <div>
    <TimeSync />
    <YouTube
      opts={DEFAULT_YOUTUBE_OPTIONS}
      videoId={props.src}
      onReady={props.handleReady}
      onStateChange={props.handleStateChange}
    />
  </div>
));
