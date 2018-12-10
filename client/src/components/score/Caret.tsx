import * as React from 'react';
import { compose, branch, renderNothing, lifecycle } from 'recompose';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';
import { interpolate } from '../../utils/interpolate';
import { ISpec, Maestro } from '../../models/maestro/Maestro';
import { get } from 'lodash';

interface IProps {
  visible: boolean;
}

interface IStateProps {
  spec: ISpec | null;
  currentTimeMs: number;
  bpm: number;
}

type InnerProps = IProps & IWithMaestroProps & IStateProps;

const renderCaret = (maestro: Maestro) => {
  const { spec } = maestro;

  if (!spec) {
    return;
  }

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

  maestro.score.caret.render(x, y);
};

const maestroListener = Object.freeze({
  name: 'renderCaret',
  callback: renderCaret
});

const enhance = compose<InnerProps, IProps>(
  withMaestro,
  branch<InnerProps>(
    props => !props.visible || !props.maestro || !props.maestro.spec,
    renderNothing
  )
);

export const Caret = enhance(() => null);
