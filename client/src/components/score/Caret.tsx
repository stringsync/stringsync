import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { interpolate } from '../../utils/interpolate';
import { Maestro } from '../../models/maestro/Maestro';
import { get, first, last } from 'lodash';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IProps {
  visible: boolean;
}

const NOTE_BBOX_OFFSET = 64; // px

const renderCaret = (maestro: Maestro) => {
  const { currentSpec } = maestro;

  if (!currentSpec) {
    return;
  }

  const t0 = currentSpec.start.tick;
  const t1 = currentSpec.stop.tick;
  const t = maestro.currentTick;

  // Compute x0
  let x0: number;
  if (currentSpec.start.note) {
    x0 = currentSpec.start.note.graphic.getBBox().x + NOTE_BBOX_OFFSET;
  } else {
    // must be at beginning, get the first note
    const firstLine = first(maestro.score.lines);
    const firstMeasure = firstLine && first(firstLine.measures);
    const firstNote = firstMeasure && first(firstMeasure.notes);
    if (!firstNote) {
      // don't even try rendering if there's no first note
      return;
    }
    x0 = firstNote.graphic.getBBox().x + NOTE_BBOX_OFFSET;
  }

  // Compute x1
  let x1: number;
  if (currentSpec.stop.note) {
    const stopNote = currentSpec.stop.note;
    if (stopNote.isLast && stopNote.measure!.isLast) {
      x1 = maestro.score.svg.getBBox().width;
    } else {
      x1 = currentSpec.stop.note.graphic.getBBox().x + NOTE_BBOX_OFFSET;
    }
  } else {
    // must be at end, get the svg edge
    x1 = maestro.score.svg.getBBox().width;
  }

  const line = get(currentSpec.start.note, 'measure.line', get(currentSpec.stop.note, 'measure.line'));

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
