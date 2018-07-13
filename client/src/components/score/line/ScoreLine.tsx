import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Line, Vextab } from 'models';
import { get } from 'lodash';
import { Element as ScrollElement } from 'react-scroll';
import { scoreKey } from './scoreKey';
import { Overlap, Layer } from 'components';
import styled from 'react-emotion';

interface IOuterProps {
  vextab: Vextab;
  line: Line;
}

interface IInnerProps extends IOuterProps {
  handleScoreLineRef: (canvas: HTMLCanvasElement) => void;
  handleCaretRef: (canvas: HTMLCanvasElement) => void;
  handleLoopCaretRef: (canvas: HTMLCanvasElement) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withHandlers({
    handleCaretRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      const { renderer } = props.vextab;
    },
    handleLoopCaretRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      const { renderer } = props.vextab;
    },
    handleScoreLineRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
      if (!canvas) {
        return;
      }

      const { renderer } = props.vextab;

      renderer.assign(canvas, props.line.id);

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
  display: flex;
  justify-content: center;
`;

export const ScoreLine = enhance(props => (
  <Outer>
    <ScrollElement name={scoreKey(props.vextab, props.line)} />
    <Overlap>
      <Layer zIndex={10}>
        <canvas className="score-line" ref={props.handleScoreLineRef} />
      </Layer>
      <Layer zIndex={11}>
        <canvas className="caret-line" ref={props.handleCaretRef} />
      </Layer>
      <Layer zIndex={12}>
        <canvas className="loop-caret-line" ref={props.handleLoopCaretRef} />
      </Layer>
    </Overlap>
  </Outer>
));
