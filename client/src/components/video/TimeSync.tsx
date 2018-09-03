import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { MaestroActions } from '../../data/maestro/maestroActions';
import { loop } from 'enhancers/loop';
import { Time } from 'services';

interface IConnectProps {
  currentTimeMs: number;
  videoPlayer: Youtube.IPlayer;
  updateCurrentTimeMs: (currentTimeMs: number) => void;
}

const enhance = compose<IConnectProps, {}>(
  connect(
    (state: Store.IState) => ({
      currentTimeMs: state.maestro.currentTimeMs,
      videoPlayer: state.video.player
    }),
    (dispatch: Dispatch) => ({
      updateCurrentTimeMs: (currentTimeMs: number) => dispatch(MaestroActions.update({ currentTimeMs }))
    })
  ),
  loop((props: IConnectProps) => {
    if (!props.videoPlayer) {
      return;
    }

    const time = new Time(props.videoPlayer.getCurrentTime(), 's');
    window.ss.maestro.time = time;

    props.updateCurrentTimeMs(time.ms);
  }),
  lifecycle<IConnectProps, {}>({
    componentWillUnmount() {
      this.props.updateCurrentTimeMs(0);
    }
  })
)

/**
 * This component syncs time from the video player to the maestro store.
 */
export const TimeSync = enhance(() => null);
