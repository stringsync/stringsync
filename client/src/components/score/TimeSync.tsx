import * as React from 'react';
import { compose } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { MaestroActions } from '../../data/maestro/maestroActions';

interface IConnectProps {
  timeMs: number;
  videoPlayer: Youtube.IPlayer;
  setTime: (timeMs: number) => void;
}

const enhance = compose(
  connect(
    (state: Store.IState) => ({
      timeMs: state.maestro.timeMs,
      videoPlayer: state.video.player
    }),
    (dispatch: Dispatch) => ({
      setTime: (timeMs: number) => dispatch(MaestroActions.setTime(timeMs))
    })
  ),

);

export const TimeSync = enhance(() => null);
