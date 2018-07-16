import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Line, VextabRenderer } from 'models';
import { Vextab } from 'models/vextab/Vextab';
import styled from 'react-emotion';
import { get } from 'lodash';
import { Element as ScrollElement } from 'react-scroll';
import { scoreKey } from './scoreKey';
import { Overlap, Layer } from '../overlap';

interface IOuterProps {
  vextab: Vextab;
  line: Line;
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

      // TODO: When ready to implement loops, revisit
      // props.vextab.renderer.loopCaretRender.assign(props.line, canvas);
    },
    handleScoreCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      const { renderer } = props.vextab;

      renderer.assign(props.line, canvas);

      if (renderer.isRenderable) {
        if (!renderer.isRendered) {
          renderer.render();
        }

        const tickMap = get(window.ss, 'maestro.tickMap');
        if (tickMap) {
          tickMap.compute();
        }

        props.vextab.links.compute();
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

export const ScoreLine = enhance(props => (
  <Outer>
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
