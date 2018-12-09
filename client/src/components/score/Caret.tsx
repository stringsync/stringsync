import * as React from 'react';
import { compose, branch, renderNothing, lifecycle, ReactLifeCycleFunctionsThisArguments } from 'recompose';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { interpolate } from '../../utils/interpolate';
import { ISpec } from '../../models/maestro/Maestro';
import { msToTick } from '../../utils/conversions';
import { get } from 'lodash';
import { loop } from '../../enhancers/loop';

interface IProps {
  visible: boolean;
}

interface IStateProps {
  spec: ISpec | null;
  currentTimeMs: number;
  bpm: number;
}

type InnerProps = IProps & IWithMaestroProps & IStateProps;

let x = 0;
const renderCaret = function(this: ReactLifeCycleFunctionsThisArguments<InnerProps, {}, {}>) {
  // const { spec } = this.props;

  // if (!spec || !spec.start.note || !spec.stop.note) {
  //   return;
  // }

  // const t0 = spec.start.tick;
  // const t1 = spec.stop.tick;
  // const x0 = spec.start.note.graphic.getBBox().x;
  // const x1 = spec.stop.note.graphic.getBBox().x;
  // const t = msToTick(this.props.currentTimeMs, this.props.bpm);

  // const line = get(spec.start.note.measure, 'line');

  // if (!line) {
  //   throw new Error('expected note to be hydrated with a measure');
  // }

  // const x = interpolate({ x: t0, y: x0 }, { x: t1, y: x1 }, t);
  // const y = line.graphic.getBBox().y;

  this.props.maestro!.score.caret.render(x += 2, 0);
};

const enhance = compose<InnerProps, IProps>(
  withMaestro,
  branch<InnerProps>(
    props => !props.visible || !props.maestro,
    renderNothing
  ),
  loop((props: any) => {
    props.maestro!.score.caret.render(x += 2, 0);
  })
  // connect <IStateProps, {}, {}, IStore>(
  //   state => ({
  //     spec: state.score.spec,
  //     currentTimeMs: state.video.currentTimeMs,
  //     bpm: state.notation.bpm
  //   })
  // ),
  // lifecycle<InnerProps, {}, {}>({
  //   componentDidMount(): void {
  //     renderCaret.call(this);
  //   },
  //   componentDidUpdate(): void {
  //     renderCaret.call(this);
  //   }
  // })
);

export const Caret = enhance(() => null);
