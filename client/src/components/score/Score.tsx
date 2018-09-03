import * as React from 'react';
import logo from 'assets/logo.svg';
import styled from 'react-emotion';
import { Line } from './Line';
import { Title } from './Title';
import { Vextab, VextabRenderer, Factory as VextabFactory } from 'models';
import { compose, lifecycle, withProps, branch, renderNothing, withState } from 'recompose';
import { get } from 'lodash';
import { scoreKey } from './scoreKey';
import { Renderer } from './Renderer';
import { CanvasRenderables } from './canvas-renderables';
import { Editor } from './Editor';
import { connect, Dispatch } from 'react-redux';
import { EditorActions, MaestroActions } from 'data';
import { Flow } from 'vexflow';
import { Element as ScrollElement } from 'react-scroll';

const MIN_WIDTH_PER_MEASURE = 240; // px
const MIN_MEASURES_PER_LINE = 1;
const MAX_MEASURES_PER_LINE = 4;

interface IOuterProps {
  dynamic: boolean;
  notation: Notation.INotation;
  width: number;
  editMode: boolean;
}

interface IConnectProps extends IOuterProps {
  appendErrors: (errors: string[]) => void;
  removeErrors: () => void;
  setMaestroVextab: (vextab: Vextab | null) => void;
}

interface IStateProps extends IConnectProps {
  vextab: Vextab;
  setVextab: (vextab: Vextab) => void;
}

interface IVextabSyncProps extends IStateProps {
  vextabId: number;
  lineIds: number[];
}

interface IInnerProps extends IVextabSyncProps {
  measuresPerLine: number;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    null,
    (dispatch: Dispatch) => ({
      appendErrors: (errors: string[]) => dispatch(EditorActions.appendErrors(errors)),
      removeErrors: () => dispatch(EditorActions.removeErrors()),
      setMaestroVextab: (vextab: Vextab | null) => dispatch(MaestroActions.update({ vextab }))
    })
  ),
  withProps((props: IConnectProps) => {
    let measuresPerLine;
    
    // compute mpl based on width
    measuresPerLine = Math.floor(props.width / MIN_WIDTH_PER_MEASURE);

    // ensure mpl >= MIN_MEASURES_PER_LINE
    measuresPerLine = Math.max(measuresPerLine, MIN_MEASURES_PER_LINE);

    // ensure mpl <= MAX_MEASURES_PER_LINE
    measuresPerLine = Math.min(measuresPerLine, MAX_MEASURES_PER_LINE);

    return { measuresPerLine };
  }),
  withState('vextab', 'setVextab', new Vextab([], new Flow.Tuning(), 1, 640)),
  lifecycle<IInnerProps, {}>({
    componentDidUpdate(prevProps) {
      const shouldCreateVextab = (
        prevProps.width !== this.props.width ||
        prevProps.notation.vextabString !== this.props.notation.vextabString ||
        prevProps.measuresPerLine !== this.props.measuresPerLine
      );

      let vextab;
      if (shouldCreateVextab && this.props.notation.vextabString.length > 0) {
        let staves: Vextab.Parsed.IStave[] =[];

        // Parse the vextabString
        try {
          staves = Vextab.decode(this.props.notation.vextabString);
          this.props.removeErrors();
        } catch (error) {
          if (this.props.editMode) {
            this.props.appendErrors([error.message]);
            return;
          } else {
            throw error;
          }
        }

        // create a new Vextab object using the factory
        const factory = new VextabFactory(
          staves, window.ss.maestro.tuning, this.props.measuresPerLine, this.props.width
        )

        vextab = factory.newInstance();
        this.props.setMaestroVextab(vextab);
        this.props.setVextab(vextab);
      } else {
        vextab = this.props.vextab;
      }

      // Sync the Vextab with Maestro's vextab
      window.ss.maestro.vextab = vextab;
    }
  }),
  branch<IInnerProps>(props => !props.vextab, renderNothing)
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
    <ScrollElement name="score-top" />
    <Editor />
    <Renderer editMode={props.editMode} />
    <CanvasRenderables active={props.dynamic} />
    <Title
      songName={props.notation.songName}
      artistName={props.notation.artistName}
      transcriberName={get(props.notation.transcriber, 'name') || ''}
    />
    {
      props.vextab.lines.map(line => (
        <Line
          editMode={props.editMode}
          key={`key-${scoreKey(props.vextab, line)}`}
          line={line}
          vextab={props.vextab}
        />
      ))
    }
    {props.dynamic ? <Spacer><Logo src={logo}  alt="logo" /></Spacer> : null}
    {props.children}
  </Outer>
));
