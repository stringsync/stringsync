import * as React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Vextab, Line } from 'models';
import { CaretRenderer } from 'models/vextab/renderers/CaretRenderer';
import { get } from 'lodash';
import { Time, Maestro } from 'services';
import { interpolate } from 'utilities';
import { observeMaestro } from 'enhancers';

interface IConnectProps {
  bpm: number;
  currentTimeMs: number;
  noteIndex: number | null;
  loopStartTimeMs: number;
  loopEndTimeMs: number;
  vextab: Vextab | null;
}

interface IHandlerProps extends IConnectProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IHandlerProps, {}>(
  connect(
    (state: Store.IState) => ({
      currentTimeMs: state.maestro.currentTimeMs,
      vextab: state.maestro.vextab
    })
  ),
  withHandlers({
    handleNotification: () => (maestro: Maestro) => {
      const { state, vextab } = maestro;
      const { start, stop, note, time } = state;
      const line = get(note, 'measure.line') as Line | void;
      
      // This if statement is formatted for this for the linter and compiler.
      if (
        !line ||
        !note ||
        !note.isHydrated ||
        !time ||
        !vextab ||
        typeof start !== 'number' ||
        typeof stop !== 'number'
      ) {
        return;
      }
      
      // Do interpolation
      const x0 = note!.vexAttrs!.staveNote.getAbsoluteX();

      const t = time.tick;
      const t0 = start;
      const t1 = stop;

      const curr = note;
      const next = note.next;

      let x1: number;
      if (!next) {
        // currently on last note
        x1 = vextab.caretRenderer.width;
      } else if (curr.measure && curr.measure.line !== get(next, 'measure.line')) {
        // next note is on a different line
        x1 = vextab.caretRenderer.width;
      } else {
        // most frequent case: note is on the same line
        x1 = next.vexAttrs!.staveNote.getAbsoluteX();
      }

      const x = interpolate({ x: t0, y: x0 }, { x: t1, y: x1 }, t);
      vextab.caretRenderer.render(x, line);
    }
  }),
  observeMaestro(
    (props: IHandlerProps) => ({ name: 'FretboardController', handleNotification: props.handleNotification })
  )
);

export const Caret = enhance(() => null);
