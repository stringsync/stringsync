import * as React from 'react';
import { Slider } from 'antd';
import styled from 'react-emotion';
import { compose, withState, withHandlers } from 'recompose';
import { IPlayer } from '../../../@types/youtube';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { subscribeMaestro } from '../../../enhancers/subscribeMaestro';
import { msToS } from '../../../utils/conversions';
import { SliderValue } from 'antd/lib/slider';

interface IStateProps {
  player: IPlayer | null;
  isVideoActive: boolean | void;
  durationMs: number;
}

interface IInnerStateProps {
  sliderValue: number;
  scrubbing: boolean;
  playAfterScrub: boolean;
  setSliderValue: (sliderValue: number) => void;
  setScrubbing: (isScrubbing: boolean) => void;
  setPlayAfterScrub: (playAfterScrub: boolean) => void;
}

interface IHandlerProps {
  scrub: (value: SliderValue) => void;
  afterScrub: (value: SliderValue) => void;
}

type InnerProps = IStateProps & IInnerStateProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, {}, {}, IStore>(
    state => ({
      player: state.video.player,
      isVideoActive: state.video.isActive,
      durationMs: state.notation.durationMs
    })
  ),
  withState('sliderValue', 'setSliderValue', 0),
  withState('scrubbing', 'setScrubbing', false),
  withState('playAfterScrub', 'setPlayAfterScrub', false),
  withHandlers<IStateProps & IInnerStateProps, IHandlerProps>({
    scrub: props => value => {
      if (typeof value !== 'number') {
        return;
      }

      if (!props.scrubbing && value < 100) {
        props.setScrubbing(true);
        props.setPlayAfterScrub(!!props.isVideoActive);
      }

      if (props.player) {
        if (props.isVideoActive) {
          props.player.pauseVideo();
        }

        const timeS = msToS(props.durationMs * (value / 100));

        if (typeof timeS === 'number' && !isNaN(timeS)) {
          props.player.seekTo(timeS, true);
        }
      }

      props.setSliderValue(value);
    },
    afterScrub: props => value => {
      if (typeof value !== 'number') {
        return;
      }

      if (props.player) {
        const timeS = msToS(props.durationMs * (value / 100));

        if (typeof timeS === 'number' && !isNaN(timeS)) {
          props.player.seekTo(timeS, true);
        }

        if (props.playAfterScrub) {
          props.player.playVideo();
        }
      }

      props.setSliderValue(value);
      props.setPlayAfterScrub(false);
      props.setScrubbing(false);
    }
  }),
  subscribeMaestro<InnerProps>(props => ({
    name: 'updateSliderValue',
    callback: maestro => {
      if (props.scrubbing) {
        return;
      }

      const sliderValue = (maestro.currentTimeMs / props.durationMs) * 100;

      const shouldSetSliderValue = (
        typeof sliderValue === 'number' &&
        !isNaN(sliderValue) &&
        props.sliderValue !== sliderValue
      );

      if (shouldSetSliderValue) {
        props.setSliderValue(sliderValue);
      }
    }
  }))
);

const Outer = styled('div')`
  padding: 0 16px 2px 16px;
`;

export const Scrubber = enhance(props => (
  <Outer>
    <Slider
      min={0}
      step={0.01}
      max={100}
      tipFormatter={null}
      value={props.sliderValue}
      onChange={props.scrub}
      onAfterChange={props.afterScrub}
    />
  </Outer>
));
