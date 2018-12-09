import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { Maestro, ISpec } from '../../models/maestro/Maestro';
import { loop } from '../../enhancers/loop';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { msToTick } from '../../utils/conversions';
import { ScoreActions } from '../../data/score/scoreActions';

interface IProps {
  maestro: Maestro | null;
}

interface IStateProps {
  currentTimeMs: number;
  spec: ISpec | null;
  bpm: number;
}

interface IDispatchProps {
  setSpec: (spec: ISpec | null) => void;
}

type InnerProps = IProps & IStateProps & IDispatchProps;

const enhance = compose<InnerProps, IProps>(
  branch<IProps>(
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
  loop((props: InnerProps) => {
    const tick = msToTick(props.currentTimeMs, props.bpm);

    const shouldUpdateSpec = (
      !props.spec ||
      props.spec.start.tick > tick ||
      props.spec.stop.tick <= tick
    );

    if (shouldUpdateSpec) {
      props.setSpec(props.maestro!.spec(tick));
    }
  })
);

export const SpecSync = enhance(() => null);
