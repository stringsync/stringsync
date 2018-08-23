import * as React from 'react';
import { compose, lifecycle, branch, renderComponent } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { connect, Dispatch } from 'react-redux';
import { fetchNotation, VideoActions, NotationActions, UiActions, EditorActions } from 'data';
import { NotSupported } from './NotSupported';
import { Row, Col } from 'antd';
import { EditVideo } from './EditVideo';
import styled from 'react-emotion';
import { EditScore } from './EditScore';
import { Fretboard, MaestroController, Overlap, Layer } from 'components';
import { VideoControls } from 'modules/video-controls';
import { Menu } from 'modules/notations/menu';
import { Controls } from './controls';

export const MINIMUM_VIEWPORT_WIDTH = 760; // px

type OuterProps = RouteComponentProps<{ id: string }>;

interface IInnerProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  viewportType: ViewportTypes;
  fetchNotation: (id: number) => Notation.INotation;
  resetNotation: () => void;
  resetVideo: () => void;
  resetUi: () => void;
  setVideo: (video: Video.IVideo) => void;
  setFretboardVisibility: (visibility: boolean) => void;
  setEditorEnabled: (enabled: boolean) => void;
}

const enhance = compose<IInnerProps, OuterProps>(
  connect(
    (state: Store.IState) => ({
      notation: state.notation,
      viewportType: state.viewport.type,
      viewportWidth: state.viewport.width
    }),
    (dispatch: Dispatch) => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetNotation: () => dispatch(NotationActions.resetNotation()),
      resetUi: () => dispatch(UiActions.reset()),
      resetVideo: () => dispatch(VideoActions.resetVideo()),
      setEditorEnabled: (enabled: boolean) => dispatch(EditorActions.setEnabled(enabled)),
      setFretboardVisibility: (visibility: boolean) => dispatch(UiActions.setFretboardVisibility(visibility)),
      setVideo: (video: Video.IVideo) => dispatch(VideoActions.setVideo(video))
    })
  ),
  lifecycle<IInnerProps, {}>({
    async componentDidMount() {
      $('body').addClass('no-scroll');
      this.props.resetNotation();
      this.props.resetVideo();
      this.props.resetUi();
      this.props.setFretboardVisibility(true);
      this.props.setEditorEnabled(true);

      const id = parseInt(this.props.match.params.id, 10);

      try {
        await this.props.fetchNotation(id);

        const { video } = this.props.notation;
        if (video) {
          this.props.setVideo(video)
        }
      } catch (error) {
        console.error(error);
        window.ss.message.error('something went wrong');
      }
    },
    componentWillUnmount() {
      $('body').removeClass('no-scroll');
      this.props.setEditorEnabled(false);
    }
  }),
  branch<IInnerProps>(
    props => props.viewportWidth < MINIMUM_VIEWPORT_WIDTH,
    renderComponent(NotSupported)
  )
);

const StyledRow = styled(Row)`
  background: white;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const LeftCol = styled(Col)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #efefef;
  padding-bottom: 128px;
`;

const LeftColInner = styled('div')`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  
  ::-webkit-scrollbar {
    display: none;
  }
`

const RightCol = styled(Col)`
  overflow: hidden;
`;

/**
 * The purpose of this component is to manage the state.notations.edit and video state
 * as well as setting the layout for the NotationEdit component.
 */
export const Edit = enhance(props => (
  <div>
    <MaestroController
      bpm={props.notation.bpm}
      durationMs={props.notation.durationMs}
      deadTimeMs={props.notation.deadTimeMs}
    />
    <StyledRow type="flex">
      <LeftCol span={8}>
        <EditVideo />
        <LeftColInner>
          <Controls />
        </LeftColInner>
      </LeftCol>
      <RightCol span={16}>
        <Overlap>
          <Layer zIndex={10}>
            <Fretboard />
            <EditScore />
          </Layer>
          <Layer zIndex={11}>
            <Menu />
            <VideoControls />
          </Layer>
        </Overlap>
      </RightCol>
    </StyledRow>
  </div>
));
