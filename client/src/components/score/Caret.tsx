import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { interpolate } from '../../utils/interpolate';
import { ISpec, Maestro } from '../../models/maestro/Maestro';
import { get } from 'lodash';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IProps {
  visible: boolean;
}

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

const maestroListener = Object.freeze({ name: 'renderCaret', callback: renderCaret });

const enhance = compose<IProps, IProps>(
  branch<IProps>(
    props => !props.visible,
    renderNothing
  ),
  subscribeMaestro(maestroListener)
);

export const Caret = enhance(() => null);
