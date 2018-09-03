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
  editMode: boolean;
}

interface IInnerProps extends IOuterProps {
  handleScoreCanvasRef: (canvas: HTMLCanvasElement) => void;
  handleCaretCanvasRef: (canvas: HTMLCanvasElement) => void;
  handleLoopCaretCanvasRef: (canvas: HTMLCanvasElement) => void;
  handleSelectorCanvasRef: (canvas: HTMLCanvasElement) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withHandlers({
    handleCaretCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      props.vextab.caretRenderer.assign(props.line, canvas);
    },
    handleLoopCaretCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      props.vextab.loopCaretRenderer.assign(props.line, canvas);
    },
    handleScoreCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      const { scoreRenderer } = props.vextab;

      try {
        scoreRenderer.assign(props.line, canvas);
      } catch (error) {
        if (props.editMode) {
          console.error(error);
        }  else {
          throw error;
        }
      }

      // If all of the score lines are rendered, trigger a notification.
      // The score/Renderer component should take care of renderering the vextab.
      if (scoreRenderer.isRenderable && !scoreRenderer.isRendered) {
        const { maestro } = window.ss;
        maestro.changed = true;
        maestro.notify();
      }
    },
    handleSelectorCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      props.vextab.selectorRenderer.assign(props.line, canvas);
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
  width: ${props => props.vextab.scoreRenderer.width}px;
  height: ${props => props.vextab.scoreRenderer.height}px;
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
        <Layer zIndex={13}>
          <canvas ref={props.handleSelectorCanvasRef} />
        </Layer>
      </Overlap>
    </Inner>
  </Outer>
));
