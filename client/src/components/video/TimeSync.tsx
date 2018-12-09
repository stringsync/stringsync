import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { VideoActions } from '../../data/video/videoActions';
import { IPlayer } from '../../@types/youtube';
import { loop } from '../../enhancers/loop';
import { sToMs } from '../../utils/conversions';

interface IStateProps {
  player: IPlayer | null;
  currentTimeMs: number;
}

interface IDispatchProps {
  setCurrentTimeMs: (currentTimeMs: number) => void;
}

type InnerProps = IStateProps & IDispatchProps;

const enhance = compose <InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      player: state.video.player,
      currentTimeMs: state.video.currentTimeMs
    }),
    dispatch => ({
      setCurrentTimeMs: (currentTimeMs: number) => dispatch(VideoActions.setCurrentTimeMs(currentTimeMs))
    })
  ),
  loop((props: InnerProps) => {
    if (!props.player) {
      return;
    }

    const timeS = props.player.getCurrentTime();
    const timeMs = sToMs(timeS);

    if (props.currentTimeMs !== timeMs) {
      props.setCurrentTimeMs(timeMs);
    }
  })
);

export const TimeSync = enhance(() => null);
