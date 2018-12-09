import * as React from 'react';
import { compose, branch, renderNothing, lifecycle, withProps } from 'recompose';
import { ISpec } from '../../models/maestro/Maestro';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { msToTick } from '../../utils/conversions';
import { ScoreActions } from '../../data/score/scoreActions';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';

interface IStateProps {
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
      spec: state.score.spec
    }),
    dispatch => ({
      setSpec: (spec: ISpec | null) => dispatch(ScoreActions.setSpec(spec))
    })
  ),
  lifecycle<InnerProps, {}, {}>({
    componentDidMount(): void {
      this.props.setSpec(this.props.maestro!.spec);
    },
    shouldComponentUpdate(): boolean {
      return (
        !this.props.spec ||
        this.props.spec.start.tick > this.props.tick ||
        this.props.spec.stop.tick <= this.props.tick
      );
    },
    componentDidUpdate(): void {
      this.props.setSpec(this.props.maestro!.spec);
    }
  })
);

export const SpecSync = enhance(() => null);
