import * as React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Slider } from 'antd';
import { connect } from 'react-redux';
import { Time, Maestro } from 'services';
import styled from 'react-emotion';
import { SliderProps } from 'antd/lib/slider';
import { observeMaestro } from 'enhancers';

interface IInnerProps {
  videoPlayer: Youtube.IPlayer;
  isVideoPlaying: boolean;
  durationMs: number;
  value: number;
  playAfterChange: boolean;
  isScrubbing: boolean;
  setValue: (value: number) => void;
  setPlayAfterChange: (playAfterChange: boolean) => void;
  setIsScrubbing: (isScrubbing: boolean) => void;
  valueToTimeMs: (value: number) => number;
  handleChange: (value: number) => void;
  handleAfterChange: (value: number) => void;
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      durationMs: state.notation.durationMs,
      isVideoPlaying: state.video.playerState === 'PLAYING',
      videoPlayer: state.video.player
    })
  ),
  withState('value', 'setValue', 0),
  withState('playAfterChange', 'setPlayAfterChange', false),
  withState('isScrubbing', 'setIsScrubbing', false),
  withProps((props: any) => ({
    valueToTimeMs: (value: number) => (value / 100) * props.durationMs
  })),
  withHandlers({
    handleAfterChange: (props: any) => (value: number) => {
      if (props.playAfterChange) {
        props.videoPlayer.playVideo();
      }

      const seekToTimeMs = props.valueToTimeMs(value);

      if (window.ss.maestro) {
        window.ss.maestro.time = new Time(seekToTimeMs, 'ms');
      }

      props.setValue(value);

      props.setPlayAfterChange(false);
      props.setIsScrubbing(false);
    },
    handleChange: (props: any) => (value: number) => {
      // For some reason, when the video ends, this handler gets called
      if (!props.isScrubbing && value < 100) {
        props.setIsScrubbing(true);
        props.setPlayAfterChange(props.isVideoPlaying);
      }

      if (props.videoPlayer) {
        props.videoPlayer.pauseVideo();
      }

      const seekToTimeMs = props.valueToTimeMs(value);

      if (window.ss.maestro) {
        window.ss.maestro.time = new Time(seekToTimeMs, 'ms');

        if (props.videoPlayer) {
          props.videoPlayer.seekTo(seekToTimeMs / 1000, true);
        }

        props.setValue(value);
      }
    }
  }),
  withHandlers({
    handleNotification: (props: any) => async (maestro: Maestro) => {
      // TODO: Kind of janky... We rely on the scrubber to manipulate the video
      // time. At the time this code was written, it felt like the path of
      // least resistance to get the feature working
      const { time, loopStart, loopEnd } = maestro.state;
      const { videoPlayer, isVideoPlaying } = props;

      const beat = new Time(1 / maestro.bpm, 'min', maestro.bpm);

      let target: Time;
      if (time.ms < (loopStart.ms - 10) || time.ms >= loopEnd.ms) {
        target = loopStart;

        if (videoPlayer) {
          if (isVideoPlaying) {
            videoPlayer.pauseVideo();
            videoPlayer.seekTo(loopStart.s, true);
            window.setTimeout(() => videoPlayer.playVideo(), beat.ms);
          } else {
            videoPlayer.seekTo(loopStart.s, true);
          }
        }
      } else {
        target = time;
      }

      maestro.time = new Time(target.ms, 'ms');
      const value = 100 * target.ms / props.durationMs;

      // Guard against NaN since it makes the page crash
      if (!isNaN(value) && !props.isScrubbing) {
        props.setValue(value);
      }
    }
  }),
  observeMaestro<IInnerProps>(props => ({ name: 'Scrubber', handleNotification: props.handleNotification }))
);

// Hack to allow the style prop directly on Slider
interface IStyledSliderProps extends SliderProps {
  style: { [key: string]: string | number };
}

const StyledSlider = styled(Slider)<IStyledSliderProps>`
  .ant-slider-handle {
    border-color: ${props => props.theme.primaryColor};
    background-color: ${props => props.theme.primaryColor};
  }

  .ant-slider-track {
    background: ${props => props.theme.primaryColor};
  }

  .ant-slider-rail {
    background-color: #efefef;
  }
`;

export const Scrubber = enhance(props => (
  <StyledSlider
    onChange={props.handleChange}
    onAfterChange={props.handleAfterChange}
    value={props.value}
    tipFormatter={null}
    step={0.01}
    style={{ margin: '4px' }}
  />
));
