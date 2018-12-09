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

const enhance = compose<InnerProps, IProps>(
  withMaestro,
  branch<InnerProps>(
    props => !props.visible || !props.maestro || !props.maestro.spec,
    renderNothing
  ),
  loop((props: any) => {
    const { maestro } = props;
    const { spec } = maestro;

    const t0 = spec.start.tick;
    const t1 = spec.stop.tick;
    const x0 = spec.start.note.graphic.getBBox().x;
    const x1 = spec.stop.note.graphic.getBBox().x;
    const t = maestro.currentTick;

    const line = get(spec.start.note.measure, 'line');

    if (!line) {
      throw new Error('expected note to be hydrated with a measure');
    }

    const x = interpolate({ x: t0, y: x0 }, { x: t1, y: x1 }, t);
    const y = line.graphic.getBBox().y;

    props.maestro.score.caret.render(x, y);
  })
);

export const Caret = enhance(() => null);
