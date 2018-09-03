import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { MaestroActions } from '../../data/maestro/maestroActions';
import { loop } from 'enhancers/loop';
import { Time } from 'services';

interface IConnectProps {
  videoPlayer: Youtube.IPlayer;
}

const enhance = compose<IConnectProps, {}>(
  connect(
    (state: Store.IState) => ({
      videoPlayer: state.video.player
    })
  ),
  loop((props: IConnectProps) => {
    if (!props.videoPlayer) {
      return;
    }

    const time = new Time(props.videoPlayer.getCurrentTime(), 's');
    window.ss.maestro.time = time;
  }),
  lifecycle<IConnectProps, {}>({
    componentWillUnmount() {
      window.ss.maestro.time = new Time(0, 'ms');
    }
  })
)

/**
 * This component syncs time from the video player to the maestro store.
 */
export const TimeSync = enhance(() => null);
