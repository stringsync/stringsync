import * as React from 'react';
import logo from 'assets/logo.svg';
import styled from 'react-emotion';
import { Line } from './Line';
import { Title } from './Title';
import { Vextab, VextabRenderer } from 'models';
import { compose, withState, lifecycle, withProps } from 'recompose';
import { get } from 'lodash';
import { scoreKey } from './scoreKey';
import { Renderer } from './Renderer';
import { CanvasRenderables } from './canvas-renderables';
import { Selector } from './canvas-renderables/Selector';

const MIN_WIDTH_PER_MEASURE = 240; // px
const MIN_MEASURES_PER_LINE = 1;
const MAX_MEASURES_PER_LINE = 4;

interface IOuterProps {
  dynamic: boolean;
  notation: Notation.INotation;
  width: number;
  selector: boolean;
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
      const shouldCreateVextab = (
        this.props.width !== nextProps.width ||
        this.props.notation.vextabString !== nextProps.notation.vextabString ||
        this.props.measuresPerLine !== nextProps.measuresPerLine
      );

      let vextab;
      if (shouldCreateVextab && nextProps.notation.vextabString.length > 0) {
        vextab = new Vextab(
          Vextab.decode(nextProps.notation.vextabString), nextProps.measuresPerLine, nextProps.width
        );
        nextProps.setVextab(vextab);
      } else {
        vextab = nextProps.vextab;
      }

      // Sync the Vextab with Maestro's vextab
      window.ss.maestro.vextab = vextab;
    }
  })
);

interface IOuterDiv {
  dynamic: boolean;
}

const Outer = styled('div')<IOuterDiv>`
  background: white;
  max-height: 1040px;
  overflow-x: ${props => props.dynamic ? 'hidden' : 'scroll'};
  overflow-y: scroll;
  position: relative;
  padding-top: 48px;
  -webkit-overflow-scrolling: touch;

  ::-webkit-scrollbar { 
    display: none; 
  }
`;

const Logo = styled('img')`
  width: 64px;
  margin-top: 128px;
`;

const Spacer = styled('div')`
  height: ${() => VextabRenderer.DEFAULT_LINE_HEIGHT * 4}px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const Score = enhance(props => (
  <Outer id="score" dynamic={props.dynamic}>
    <Renderer />
    {props.selector ? <Selector vextab={props.vextab} />  : null}
    <CanvasRenderables active={props.dynamic} />
    <Title
      songName={props.notation.songName}
      artistName={props.notation.artistName}
      transcriberName={get(props.notation.transcriber, 'name') || ''}
    />
    {
      props.vextab.lines.map(line => (
        <Line
          key={`key-${scoreKey(props.vextab, line)}`}
          line={line}
          vextab={props.vextab}
        />
      ))
    }
    {props.dynamic ? <Spacer><Logo src={logo}  alt="logo" /></Spacer> : null}
  </Outer>
));
