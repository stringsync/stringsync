import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Line } from 'models';
import { Vextab } from '../../models/vextab/Vextab';

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
      props.vextab.renderer.assign(canvas, props.line.id);
    }
  })
);

export const ScoreLine = enhance(props => (
  <div>
    <canvas ref={props.handleCanvasRef} />
  </div>
));
