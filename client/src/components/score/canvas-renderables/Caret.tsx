import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Vextab } from 'models';
import { CaretRenderer } from 'models/vextab/renderers/CaretRenderer';
import { get } from 'lodash';
import { Time } from 'services';
import { interpolate } from 'utilities';

interface IConnectProps {
  bpm: number;
  currentTimeMs: number;
  elementIndex: number | null;
  loopStartTimeMs: number;
  loopEndTimeMs: number;
  vextab: Vextab | null;
}

const enhance = compose<IConnectProps, {}>(
  connect(
    (state: Store.IState) => ({
      bpm: state.notation.bpm,
      currentTimeMs: state.maestro.currentTimeMs,
      elementIndex: state.maestro.elementIndex,
      loopEndTimeMs: state.maestro.loopEndTimeMs,
      loopStartTimeMs: state.maestro.loopStartTimeMs,
      vextab: state.maestro.vextab
    })
  ),
  lifecycle<IConnectProps, {}>({
    componentDidUpdate() {
      const {
        vextab, elementIndex, loopStartTimeMs, loopEndTimeMs, bpm, currentTimeMs
      } = this.props;

      if (!vextab || typeof elementIndex !== 'number') {
        return;
      }

      const element = vextab.elements[elementIndex] || null;
      
      if (!element || !element.isHydrated) {
        return;
      }

      const line = get(element.measure, 'line');

      if (!line) {
        return;
      }
      
      // Do interpolation
      const x0 = element.vexAttrs!.staveNote.getAbsoluteX();

      const t = new Time(currentTimeMs, 'ms', bpm).tick;
      const t0 = new Time(loopStartTimeMs, 'ms', bpm).tick;
      const t1 = new Time(loopEndTimeMs, 'ms', bpm).tick;

      const curr = element;
      const next = element.next;

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
  })
);

export const Caret = enhance(() => null);
