import * as React from 'react';
import { Slider } from 'antd';
import styled from 'react-emotion';
import { compose, withState, branch, renderNothing } from 'recompose';
import { IPlayer } from '../../../@types/youtube';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { subscribeMaestro } from '../../../enhancers/subscribeMaestro';

interface IStateProps {
  player: IPlayer | null;
  isVideoActive: boolean | void;
  durationMs: number;
}

interface ISliderValueProps {
  sliderValue: number;
  setSliderValue: (sliderValue: number) => void;
}

type InnerProps = IStateProps & ISliderValueProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, {}, {}, IStore>(
    state => ({
      player: state.video.player,
      isVideoActive: state.video.isActive,
      durationMs: state.notation.durationMs
    })
  ),
  withState('sliderValue', 'setSliderValue', 0),
  branch<InnerProps>(
    props => typeof props.durationMs !== 'number' || props.durationMs <= 0,
    renderNothing
  ),
  subscribeMaestro<InnerProps>(props => ({
    name: 'updateSliderValue',
    callback: maestro => {
      props.setSliderValue((maestro.currentTimeMs / props.durationMs) * 100);
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
      value={props.sliderValue}
    />
  </Outer>
));
