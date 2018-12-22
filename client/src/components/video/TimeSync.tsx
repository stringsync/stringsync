import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { IPlayer } from '../../@types/youtube';
import { loop } from '../../enhancers/loop';
import { sToMs } from '../../utils/conversions';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';

interface IStateProps {
  player: IPlayer | null;
}

type InnerProps = IStateProps & IWithMaestroProps;

const enhance = compose <InnerProps, {}>(
  connect<IStateProps, {}, {}, IStore>(
    state => ({
      player: state.video.player
    })
  ),
  withMaestro,
  branch<InnerProps>(
    props => !props.player || !props.maestro,
    renderNothing
  ),
  loop((props: InnerProps) => {
    const timeS = props.player!.getCurrentTime();
    props.maestro!.currentTimeMs = sToMs(timeS);
  })
);

export const TimeSync = enhance(() => null);
