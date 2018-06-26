import * as React from 'react';
import styled from 'react-emotion';
import { ScoreLine } from './ScoreLine';
import { compose, withState, lifecycle } from 'recompose';
import { Vextab } from 'models';

interface IOuterProps {
  vextabString: string;
  measuresPerLine: number;
}

interface IInnerProps extends IOuterProps {
  vextab: Vextab;
  setVextab: (vextab: Vextab) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withState('vextab', 'setVextab', new Vextab([], 1)),
  lifecycle<IInnerProps, {}>({
    componentWillUpdate(nextProps) {
      const shouldSetVextab = (
        this.props.vextabString !== nextProps.vextabString ||
        this.props.measuresPerLine !== nextProps.measuresPerLine
      );

      if (shouldSetVextab) {
        const vextab = new Vextab(Vextab.decode(nextProps.vextabString), this.props.measuresPerLine);
        (window as any).vextab = vextab;
        nextProps.setVextab(vextab);
      }
    }
  })
);

export const Score = enhance(props => (
  <div>
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
  </div>
));
