import * as React from 'react';
import styled from 'react-emotion';
import { ScoreLine } from './ScoreLine';
import { compose, withState, lifecycle } from 'recompose';
import { Vextab } from 'models';
import { connect } from 'react-redux';
import { Row } from 'antd';

interface IOuterProps {
  vextabString: string;
  measuresPerLine: number;
}

interface IInnerProps extends IOuterProps {
  vextab: Vextab;
  viewportWidth: number;
  setVextab: (vextab: Vextab) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      viewportWidth: state.viewport.width
    })
  ),
  withState('vextab', 'setVextab', new Vextab([], 1)),
  lifecycle<IInnerProps, {}>({
    componentWillUpdate(nextProps) {
      const shouldSetVextab = (
        this.props.vextabString !== nextProps.vextabString ||
        this.props.measuresPerLine !== nextProps.measuresPerLine
      );

      let vextab;
      if (shouldSetVextab) {
        vextab = new Vextab(Vextab.decode(nextProps.vextabString), this.props.measuresPerLine);
        (window as any).vextab = vextab;
        nextProps.setVextab(vextab);
      } else {
        vextab = nextProps.vextab;
      }

      // Sync the viewport width with the renderer width.
      vextab.renderer.width = Math.min(nextProps.viewportWidth, 1200);
    }
  })
);

export const Score = enhance(props => (
  <Row type="flex" justify="center" align="middle">
    {
      props.vextab.lines.map((line, ndx) => {
        return (
          <ScoreLine
            key={`score-line-${ndx}`}
            line={line}
            vextab={props.vextab}
          />
        );
      })
    }
  </Row>
));
