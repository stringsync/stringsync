import * as React from 'react';
import { compose, branch, renderNothing, lifecycle, withProps } from 'recompose';
import { Maestro, ISpec } from '../../models/maestro/Maestro';
import { loop } from '../../enhancers/loop';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { msToTick } from '../../utils/conversions';
import { ScoreActions } from '../../data/score/scoreActions';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';

interface IStateProps {
  currentTimeMs: number;
  spec: ISpec | null;
  bpm: number;
}

interface IDispatchProps {
  setSpec: (spec: ISpec | null) => void;
}

type ConnectProps = IWithMaestroProps & IStateProps & IDispatchProps;

interface ITickProps {
  tick: number;
}

type InnerProps = ConnectProps & ITickProps;

const enhance = compose<InnerProps, {}>(
  withMaestro,
  branch<IWithMaestroProps>(
    props => !props.maestro,
    renderNothing
  ),
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      bpm: state.notation.bpm,
      currentTimeMs: state.video.currentTimeMs,
      spec: state.score.spec
    }),
    dispatch => ({
      setSpec: (spec: ISpec | null) => dispatch(ScoreActions.setSpec(spec))
    })
  ),
  withProps<ITickProps, ConnectProps>(props => ({
    tick: msToTick(props.currentTimeMs, props.bpm)
  })),
  lifecycle<InnerProps, {}, {}>({
    componentDidMount(): void {
      this.props.setSpec(this.props.maestro!.spec(this.props.tick));
    },
    shouldComponentUpdate(): boolean {
      return (
        !this.props.spec ||
        this.props.spec.start.tick > this.props.tick ||
        this.props.spec.stop.tick <= this.props.tick
      );
    },
    componentDidUpdate(): void {
      this.props.setSpec(this.props.maestro!.spec(this.props.tick));
    }
  })
);

export const SpecSync = enhance(() => null);
