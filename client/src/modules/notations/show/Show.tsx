import * as React from 'react';
import * as $ from 'jquery';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Fretboard, Score, Piano, MaestroController, Overlap, Layer } from 'components';
import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { fetchNotation, VideoActions, UiActions, NotationActions } from 'data';
import { RouteComponentProps } from 'react-router-dom';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { ShowVideo } from './ShowVideo';
import { Menu } from 'modules/notations/menu';
import { VideoControls } from 'modules/video-controls';
import { Element as ScrollElement, scroller } from 'react-scroll';

type OuterProps = RouteComponentProps<{ id: string }>;

interface IConnectProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  viewportType: ViewportTypes;
  isNotationMenuVisible: boolean;
  fetchNotation: (id: number) => Notation.INotation;
  setNotation: (notation: Notation.INotation) => void;
  setVideo: (video: Video.IVideo) => void;
  resetNotation: () => void;
  resetVideo: () => void;
  resetUi: () => void;
  setFretboardVisibility: (fretboardVisibility: boolean) => void;
}

interface IInnerProps extends IConnectProps {
  scoreWidth: number;
}

const enhance = compose<IInnerProps, OuterProps>(
  connect(
    (state: Store.IState) => ({
      isNotationMenuVisible: state.ui.isNotationMenuVisible,
      notation: state.notation,
      viewportType: state.viewport.type,
      viewportWidth: state.viewport.width
    }),
    dispatch => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetNotation: () => dispatch(NotationActions.resetNotation()),
      resetUi: () => dispatch(UiActions.reset()),
      resetVideo: () => dispatch(VideoActions.resetVideo()),
      setFretboardVisibility: (visibility: boolean) => dispatch(UiActions.setFretboardVisibility(visibility)),
      setVideo: (video: Video.IVideo) => dispatch(VideoActions.setVideo(video))
    })
  ),
  withProps((props: IConnectProps) => ({
    scoreWidth: Math.max(Math.min(props.viewportWidth, 1200), 200) - 30
  })),
  lifecycle<IInnerProps, {}>({
    async componentDidMount() {
      $('body').addClass('no-scroll');

      this.props.resetNotation();
      this.props.resetVideo();
      this.props.resetUi();
      this.props.setFretboardVisibility(this.props.viewportType !== 'MOBILE');

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
      } finally {
        scroller.scrollTo('app-top', {});
      }
    },
    componentWillUnmount() {
      $('body').removeClass('no-scroll');
    }
  })
);

const Outer = styled('div')`
  width: 100%;
  height: 200vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// FIXME: This component is needed to hack the fretboard
const Dummy = styled('div')`
  height: 0.1px;
  background: black;
  width: 100%;
`;

/**
 * Sets layout for the NotationShow page and fetches the notation from the router.
 */
export const Show = enhance(props => (
  <Outer id="notation-show">
    <ScrollElement name="notation-show-top" />
    <MaestroController
      bpm={props.notation.bpm}
      durationMs={props.notation.durationMs}
      deadTimeMs={props.notation.deadTimeMs}
    />
    <Overlap>
      <Layer zIndex={10}>
        <div>
          <ShowVideo />
          <ScrollElement name="notation-show-score" />
          <Dummy />
          <Affix offsetTop={2}>
            <div>
              <Fretboard />
              <Piano />
            </div>
          </Affix>
        </div>
        <div>
          <Score
            editMode={false}
            dynamic={true}
            notation={props.notation}
            width={props.scoreWidth}
          />
        </div>
      </Layer>
      <Layer zIndex={11}>
        <Menu />
        <VideoControls />
      </Layer>
    </Overlap>
  </Outer>
));
