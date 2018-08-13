import * as React from 'react';
import { compose, withHandlers, withProps, withState, lifecycle } from 'recompose';
import { Slider } from 'antd';
import { connect } from 'react-redux';
import { Time, Maestro } from 'services';
import styled from 'react-emotion';
import { SliderProps } from 'antd/lib/slider';
import { observeMaestro } from 'enhancers';

type SliderValues = [number, number];

interface IConnectProps {
  durationMs: number;
  isVideoPlaying: boolean;
  videoPlayer: Youtube.IPlayer;
}

interface IStateProps extends IConnectProps {
  values: SliderValues;
  playAfterChange: boolean;
  isScrubbing: boolean;
  setValues: (values: SliderValues) => void;
  setPlayAfterChange: (playAfterChange: false) => void;
  setIsScrubbing: (isScrubbing: false) => void;
}

interface IInnerProps extends IStateProps {
  handleAfterChange: (values: SliderValues) => void;
  handleChange: (values: SliderValues) => void;
}

const enhance = compose<IInnerProps, {}>(
  connect(
    (state: StringSync.Store.IState) => ({
      durationMs: state.notations.show.durationMs,
      isVideoPlaying: state.video.playerState === 'PLAYING',
      videoPlayer: state.video.player
    })
  ),
  withState('values', 'setValues', [0, 100]),
  withState('playAfterChange', 'setPlayAfterChange', false),
  withState('isScrubbing', 'setIsScrubbing', false),
  withHandlers({
    handleAfterChange: (props: IStateProps) => (values: SliderValues) => {
      console.log('after changed');
    },
    handleChange: (props: IStateProps) => (values: SliderValues) => {
      console.log('changed');
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
