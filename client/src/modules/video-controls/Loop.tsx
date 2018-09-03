import * as React from 'react';
import { compose, withHandlers, withProps, withState } from 'recompose';
import { Slider } from 'antd';
import { connect, Dispatch } from 'react-redux';
import { Time } from 'services';
import styled from 'react-emotion';
import { SliderProps } from 'antd/lib/slider';
import { UiActions, MaestroActions } from 'data';

type SliderValues = [number, number];

interface IConnectProps {
  durationMs: number;
  isVideoPlaying: boolean;
  videoPlayer: Youtube.IPlayer;
  showLoop: boolean;
  setLoopVisibility: (showLoop: boolean) => void;
}

interface IStateProps extends IConnectProps {
  values: SliderValues;
  playAfterChange: boolean;
  isScrubbing: boolean;
  showLoopAfterChange: boolean;
  setValues: (values: SliderValues) => void;
  setPlayAfterChange: (playAfterChange: boolean) => void;
  setIsScrubbing: (isScrubbing: boolean) => void;
  setShowLoopAfterChange: (showLoopAfterChange: boolean) => void;
}

interface IValueConverterProps extends IStateProps {
  valuesToTimeMs: (values: SliderValues) => SliderValues;
}

interface IInnerProps extends IValueConverterProps {
  handleAfterChange: (values: SliderValues) => void;
  handleChange: (values: SliderValues) => void;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: Store.IState) => ({
      durationMs: state.notation.durationMs,
      isLoopVisible: state.ui.isLoopVisible,
      isVideoPlaying: state.video.playerState === 'PLAYING',
      videoPlayer: state.video.player
    }),
    (dispatch: Dispatch) => ({
      setLoopVisibility: (loopVisibility: boolean) => dispatch(UiActions.setLoopVisibility(loopVisibility))
    })
  ),
  withState('values', 'setValues', [0, 100]),
  withState('playAfterChange', 'setPlayAfterChange', false),
  withState('isScrubbing', 'setIsScrubbing', false),
  withState('showLoopAfterChange', 'setShowLoopAfterChange', false),
  withProps((props: IStateProps) => ({
    valuesToTimeMs: (values: SliderValues) => values.map(value => (value / 100) * props.durationMs)
  })),
  withHandlers({
    handleAfterChange: (props: IValueConverterProps) => (values: SliderValues) => {
      props.setLoopVisibility(props.showLoopAfterChange);

      // Update loopStart and loopEnds
      const [loopStart, loopEnd] = props.valuesToTimeMs(values).
          sort((a, b) => a - b).
          map(ms => new Time(ms, 'ms'));

      props.setValues(values);

      const { maestro } = window.ss;
      if (maestro) {
        maestro.loopStart = loopStart;
        maestro.loopEnd = loopEnd;

        // We want the player to snap back to the caret play head.
        // By forcing an update, we can achieve this.
        maestro.changed = true;
        maestro.notify();
      }

      if (props.playAfterChange) {
        props.videoPlayer.playVideo();
      }

      props.setPlayAfterChange(false);
      props.setIsScrubbing(false);
      props.setShowLoopAfterChange(false);
    },
    handleChange: (props: IValueConverterProps) => (values: SliderValues) => {
      if (!props.isScrubbing && Math.max(...values) <= 100) {
        props.setIsScrubbing(true);
        props.setPlayAfterChange(props.isVideoPlaying);

        props.setShowLoopAfterChange(props.showLoop);
        props.setLoopVisibility(true);
      }

      if (props.videoPlayer) {
        props.videoPlayer.pauseVideo();
      }

      const [loopStart, loopEnd] = props.valuesToTimeMs(values).
          sort((a, b) => a - b).
          map(ms => new Time(ms, 'ms'));

      const { maestro } = window.ss;
      if (maestro) {
        maestro.loopStart = loopStart.clone;
        maestro.loopEnd = loopEnd.clone;
      }

      props.setValues(values);
    }
  })
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

export const Loop = enhance(props => (
  <StyledSlider
    range={true}
    onChange={props.handleChange}
    onAfterChange={props.handleAfterChange}
    value={props.values}
    tipFormatter={null}
    step={0.01}
    style={{ margin: '4px' }}
  />
));
