import * as React from 'react';
import { ScoreLine } from './ScoreLine';
import { compose, withState, lifecycle, withProps } from 'recompose';
import { Vextab, VextabRenderer } from 'models';
import { ScoreScroller } from './ScoreScroller';
import { Element as ScrollElement } from 'react-scroll';
import styled from 'react-emotion';
import { scoreKey } from './scoreKey';

const MIN_WIDTH_PER_MEASURE = 240; // px
const MIN_MEASURES_PER_LINE = 1;
const MAX_MEASURES_PER_LINE = 4;

interface IOuterProps {
  vextabString: string;
  width: number;
}

interface IVextabProps extends IOuterProps {
  vextab: Vextab;
  setVextab: (vextab: Vextab) => void;
}

interface IVextabSyncProps extends IVextabProps {
  vextabId: number;
  lineIds: number[];
}

interface IInnerProps extends IVextabSyncProps {
  measuresPerLine: number;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withState('vextab', 'setVextab', new Vextab([], 1)),
  withProps((props: IVextabSyncProps) => {
    let measuresPerLine;
    
    // compute mpl based on width
    measuresPerLine = Math.floor(props.width / MIN_WIDTH_PER_MEASURE);

    // ensure mpl >= MIN_MEASURES_PER_LINE
    measuresPerLine = Math.max(measuresPerLine, MIN_MEASURES_PER_LINE);

    // ensure mpl <= MAX_MEASURES_PER_LINE
    measuresPerLine = Math.min(measuresPerLine, MAX_MEASURES_PER_LINE);

    return { measuresPerLine };
  }),
  lifecycle<IInnerProps, {}>({
    componentWillReceiveProps(nextProps) {
      if (!window.ss.maestro) {
        throw new Error('expected maestro to be defined');
      }

      const shouldCreateVextab = (
        this.props.vextabString !== nextProps.vextabString ||
        this.props.measuresPerLine !== nextProps.measuresPerLine
      );

      let vextab;
      if (shouldCreateVextab) {
        vextab = new Vextab(Vextab.decode(nextProps.vextabString), nextProps.measuresPerLine);
        nextProps.setVextab(vextab);
      } else {
        vextab = nextProps.vextab;
      }

      // Sync the component width with the renderer's width.
      vextab.renderer.width = nextProps.width;

      // Sync the Vextab with Maestro's vextab
      window.ss.maestro.vextab = vextab;
    }
  })
);

const Outer = styled('div')`
  background: white;
  max-height: 1040px;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  -webkit-overflow-scrolling: touch;
`;

const Spacer = styled('div')`
  height: ${() => VextabRenderer.DEFAULT_LINE_HEIGHT * 4}px;
`;

export const Score = enhance(props => (
  <Outer id="score">
    <ScoreScroller />
    {
      props.vextab.lines.map(line => (
        <ScoreLine
          key={`key-${scoreKey(props.vextab, line)}`}
          line={line}
          vextab={props.vextab}
        />
      ))
    }
    <Spacer />
  </Outer>
));
