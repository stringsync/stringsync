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
import { Editor } from './Editor';
import { connect, Dispatch } from 'react-redux';
import { EditorActions } from 'data';

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
  setEditorVextab: (vextab: Vextab) => void;
}

interface IVextabProps extends IConnectProps {
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
  connect(
    null,
    (dispatch: Dispatch) => ({
      appendErrors: (errors: string[]) => dispatch(EditorActions.appendErrors(errors)),
      removeErrors: () => dispatch(EditorActions.removeErrors()),
      setEditorVextab: (vextab: Vextab) => dispatch(EditorActions.setVextab(vextab))
    })
  ),
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
    componentDidUpdate(prevProps) {
      const shouldCreateVextab = (
        prevProps.width !== this.props.width ||
        prevProps.notation.vextabString !== this.props.notation.vextabString ||
        prevProps.measuresPerLine !== this.props.measuresPerLine
      );

      let vextab;
      if (shouldCreateVextab && this.props.notation.vextabString.length > 0) {
        let structs: Vextab.ParsedStruct[] =[];

        try {
          structs = Vextab.decode(this.props.notation.vextabString);
        } catch (error) {
          if (this.props.editMode) {
            this.props.appendErrors([error.message]);
            return;
          } else {
            throw error;
          }
        }

        this.props.removeErrors();

        vextab = new Vextab(structs, this.props.measuresPerLine, this.props.width);
        this.props.setVextab(vextab);

        if (this.props.editMode) {
          this.props.setEditorVextab(vextab);
        }
      } else {
        vextab = this.props.vextab;
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
