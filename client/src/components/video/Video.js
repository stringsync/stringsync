import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { videoActions } from 'data';
import YouTube from 'react-youtube';

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
    modestbranding: 1,
    playsinline: 1,
    rel: 0,
    showinfo: 0,
    disablekb: 1,
    fs: 0,
    start: 0,
    loop: 1,
  }
});

const enhance = compose(
  connect(
    state => ({
      src: state.video.src,
      kind: state.video.kind
    }),
    dispatch => ({
      setPlayer: player => dispatch(videoActions.player.set),
      setPlayerState: player => dispatch(videoActions.playerState.set)
    })
  ),
  withHandlers({
    handleReady: props => event => {
      props.setPlayer(event.target);
    },
    handleStateChange: props => event => {
      props.setPlayerState(PLAYER_STATES[event.data]);
    }
  })
);

const Video = enhance(props => (
  <div>
    <YouTube 
      opts={DEFAULT_YOUTUBE_OPTIONS}
      videoId={props.src}
      onReady={props.handleReady}
      onStateChange={props.handleStateChange}
    />
  </div>
));

export default Video;
