import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Line } from 'models';
import { Vextab } from '../../models/vextab/Vextab';
import styled from 'react-emotion';
import { Row } from 'antd';
import { get } from 'lodash';

interface IOuterProps {
  vextab: Vextab;
  line: Line;
}

interface IInnerProps {
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
`;

export const ScoreLine = enhance(props => (
  <Outer>
    <Row type="flex" justify="center" align="middle">
      <canvas ref={props.handleCanvasRef} />
    </Row>
  </Outer>
));
