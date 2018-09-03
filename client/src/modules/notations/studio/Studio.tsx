import * as React from 'react';
import * as $ from 'jquery';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Fretboard, Score, Piano, MaestroBridge, Overlap, Layer } from 'components';
import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';
import { fetchNotation, VideoActions, UiActions, NotationActions } from 'data';
import { RouteComponentProps } from 'react-router-dom';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { StudioVideo } from './StudioVideo';
import { Menu } from 'modules/notations/menu';
import { VideoControls } from 'modules/video-controls';
import { Element as ScrollElement, scroller } from 'react-scroll';
import logoSrc from 'assets/logo.svg';

type OuterProps = RouteComponentProps<{ id: string }>;

interface IConnectProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  viewportType: ViewportTypes;
  isNotationMenuVisible: boolean;
  fetchNotation: (id: number) => Notation.INotation;
  focusScrollElement: (scrollElement: string) => void;
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
      viewportWidth: state.viewport.width,
    }),
    dispatch => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      focusScrollElement: (scrollElement: string) => dispatch(UiActions.focusScrollElement(scrollElement)),
      resetNotation: () => dispatch(NotationActions.resetNotation()),
      resetUi: () => dispatch(UiActions.reset()),
      resetVideo: () => dispatch(VideoActions.resetVideo()),
      setFretboardVisibility: (visibility: boolean) => dispatch(UiActions.setFretboardVisibility(visibility)),
      setVideo: (video: Video.IVideo) => dispatch(VideoActions.setVideo(video))
    })
  ),
  withProps((props: IConnectProps) => ({
    scoreWidth: 810
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
      }
    },
    componentWillUpdate(nextProps) {
      if (this.props.viewportWidth !== nextProps.viewportWidth) {
        this.props.focusScrollElement('app-top');
        scroller.scrollTo('app-top', {});
      }
    },
    componentWillUnmount() {
      scroller.scrollTo('app-top', {});
      $('body').removeClass('no-scroll');
    }
  })
);

const Outer = styled('div')`
  width: 820px;
  height: 810px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 20px;
  border: 2px solid ${props => props.theme.primaryColor};
`;

// FIXME: This component is needed to hack the fretboard
const Dummy = styled('div')`
  height: 0.1px;
  background: black;
  width: 100%;
`;

const StyledImg = styled('img')`
  width: 50px;
  position: absolute;
  bottom: -800px;
  border-radius: 50%;
  padding: 4px;
  background: white;
  border: 3px solid ${props => props.theme.primaryColor};
`;

const LogoContainer = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

/**
 * Sets layout for the NotationShow page and fetches the notation from the router.
 */
export const Studio = enhance(props => (
  <Outer id="notation-show">
    <ScrollElement name="notation-show-top" />
    <MaestroBridge
      bpm={props.notation.bpm}
      durationMs={props.notation.durationMs}
      deadTimeMs={props.notation.deadTimeMs}
    />
    <Overlap>
      <Layer zIndex={10}>
        <div>
          <StudioVideo />
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
      <Layer zIndex={12}>
        <LogoContainer>
          <StyledImg src={logoSrc} width={200} />
        </LogoContainer>
      </Layer>
      <Layer zIndex={13}>
        <Menu />
        <VideoControls />
      </Layer>
    </Overlap>
  </Outer>
));
