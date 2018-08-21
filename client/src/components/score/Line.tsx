import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Line as LineModel, VextabRenderer, Directive } from 'models';
import { Vextab } from 'models/vextab/Vextab';
import styled from 'react-emotion';
import { get } from 'lodash';
import { Element as ScrollElement } from 'react-scroll';
import { scoreKey } from './scoreKey';
import { Overlap, Layer } from '../overlap';

interface IOuterProps {
  vextab: Vextab;
  line: LineModel;
}

interface IInnerProps extends IOuterProps {
  handleScoreCanvasRef: (canvas: HTMLCanvasElement) => void;
  handleCaretCanvasRef: (canvas: HTMLCanvasElement) => void;
  handleLoopCaretCanvasRef: (canvas: HTMLCanvasElement) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withHandlers({
    handleCaretCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      props.vextab.renderer.caretRenderer.assign(props.line, canvas);
    },
    handleLoopCaretCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      props.vextab.renderer.loopCaretRenderer.assign(props.line, canvas);
    },
    handleScoreCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      const { renderer } = props.vextab;

      renderer.assign(props.line, canvas);

      // If all of the score lines are rendered, trigger a notification.
      // The score/Renderer component should take care of renderering the vextab.
      if (renderer.isRenderable && !renderer.isRendered) {
        const { maestro } = window.ss;
        maestro.changed = true;
        maestro.notify();
      }
    }
  })
);

const Outer = styled('div')`
  height: ${() => VextabRenderer.DEFAULT_LINE_HEIGHT}px;
  display: flex;
  justify-content: center;
`;

interface IInnerDivProps {
  vextab: Vextab;
}

// It is necessary to sync the inner div's style with the vextab renderer
// so the browser can compute where the center is.
//
// The javascript in the renderers changes the style of the canvas.
const Inner = styled('div')<IInnerDivProps>`
  width: ${props => props.vextab.renderer.width}px;
  height: ${props => props.vextab.renderer.height}px;
`;

export const Line = enhance(props => (
  <Outer className="score-line">
    <ScrollElement name={scoreKey(props.vextab, props.line)} />
    <Inner vextab={props.vextab}>
      <Overlap>
        <Layer zIndex={10}>
          <canvas ref={props.handleScoreCanvasRef} />
        </Layer>
        <Layer zIndex={11}>
          <canvas ref={props.handleCaretCanvasRef} />
        </Layer>
        <Layer zIndex={12}>
          <canvas ref={props.handleLoopCaretCanvasRef} />
        </Layer>
      </Overlap>
    </Inner>
  </Outer>
));
