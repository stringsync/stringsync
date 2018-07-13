import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Line, VextabRenderer } from 'models';
import { Vextab } from 'models/vextab/Vextab';
import styled from 'react-emotion';
import { Row } from 'antd';
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
    },
    handleLoopCaretCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }
    },
    handleScoreCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      const { renderer } = props.vextab;

      renderer.assign(props.line, canvas);

      if (renderer.isRenderable) {
        renderer.render();

        const tickMap = get(window.ss, 'maestro.tickMap');
        if (tickMap) {
          tickMap.compute();
        }
      }
    }
  })
);

const Outer = styled('div')`
  width: 100%;
  height: ${() => VextabRenderer.DEFAULT_LINE_HEIGHT}px;
`;

const StyledLayer = styled(Layer)`
  display: flex;
  justify-content: center;
`;

export const ScoreLine = enhance(props => (
  <Outer>
    <ScrollElement name={scoreKey(props.vextab, props.line)} />
    <Overlap>
      <StyledLayer zIndex={10}>
        <canvas ref={props.handleScoreCanvasRef} />
      </StyledLayer>
      <Layer zIndex={11}>
        <canvas ref={props.handleCaretCanvasRef} />
      </Layer>
      <Layer zIndex={12}>
        <canvas ref={props.handleLoopCaretCanvasRef} />
      </Layer>
    </Overlap>
  </Outer>
));
