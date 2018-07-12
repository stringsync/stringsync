import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Line, VextabRenderer } from 'models';
import { Vextab } from '../../models/vextab/Vextab';
import styled from 'react-emotion';
import { Row } from 'antd';
import { get } from 'lodash';
import { Element as ScrollElement } from 'react-scroll';
import { scoreKey } from './scoreKey';

interface IOuterProps {
  vextab: Vextab;
  line: Line;
}

interface IInnerProps extends IOuterProps {
  handleCanvasRef: (canvas: HTMLCanvasElement) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withHandlers({
    handleCanvasRef: (props: IOuterProps) => (canvas: HTMLCanvasElement) => {
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
    <canvas ref={props.handleCanvasRef} />
  </Outer>
));
