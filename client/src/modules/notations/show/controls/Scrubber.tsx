import * as React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Slider } from 'antd';
import { connect } from 'react-redux';
import { withRaf, IWithRafProps } from 'enhancers';
import { RafSpec } from 'services';
import styled from 'react-emotion';
import { SliderProps } from 'antd/lib/slider';

interface IInnerProps extends IWithRafProps {
  videoPlayer: Youtube.Player;
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
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: StringSync.Store.IState) => ({
      durationMs: state.notations.show.durationMs,
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
        window.ss.maestro.timeKeeper.currentTimeMs = seekToTimeMs;
      }

      props.setValue(value);

      props.setPlayAfterChange(false);
      props.setIsScrubbing(false);
    },
    handleChange: (props: any) => (value: number) => {
      if (!props.isScrubbing) {
        props.setIsScrubbing(true);
        props.setPlayAfterChange(props.isVideoPlaying);
      }

      props.videoPlayer.pauseVideo();

      const seekToTimeMs = props.valueToTimeMs(value);

      if (window.ss.maestro) {
        window.ss.maestro.timeKeeper.currentTimeMs = seekToTimeMs;
        props.videoPlayer.seekTo(seekToTimeMs / 1000, true);
        props.setValue(value);
      }
    }
  }),
  withHandlers({
    handleRafLoop: (props: any) => () => {
      if (window.ss.maestro) {
        const value = 100 * window.ss.maestro.timeKeeper.currentTimeMs / props.durationMs;

        // Guard against NaN since it makes the page crash
        if (!isNaN(value) && !props.isScrubbing) {
          props.setValue(value);
        }
      }
    }
  }),
  withRaf(
    () => window.ss.rafLoop,
    props => new RafSpec('Scrubber.handleRafLoop', 1, props.handleRafLoop)
  )
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
