import * as React from 'react';
import * as $ from 'jquery';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Fretboard, Score, Piano, MaestroController, Overlap, Layer } from 'components';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { fetchNotation, VideoActions } from 'data';
import { RouteComponentProps } from 'react-router-dom';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { ShowVideo } from './ShowVideo';
import { Menu } from './Menu';
import { VideoControls } from 'modules/video-controls';

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
  setFretboardVisibility: (fretboardVisibility: boolean) => void;
  setPianoVisibility: (pianoVisibility: boolean) => void;
}

interface IScoreWidthProps extends IConnectProps {
  scoreWidth: number;
}

interface IMenuProps extends IScoreWidthProps {
  fretboardVisibility: boolean;
  pianoVisibility: boolean;
}

interface IMenuHandlerProps extends IMenuProps {
  handleMenuClick: (event: React.SyntheticEvent<HTMLElement>) => void;
  handleFretboardVisibilityChange: (event: CheckboxChangeEvent) => void;
  handlePianoVisibilityChange: (event: CheckboxChangeEvent) => void;
}

const getNotationShowElement = () => document.getElementById('notation-show');

const enhance = compose<IMenuHandlerProps, OuterProps>(
  connect(
    (state: Store.IState) => ({
      isNotationMenuVisible: state.ui.isNotationMenuVisible,
      notation: state.notation,
      viewportType: state.viewport.type,
      viewportWidth: state.viewport.width
    }),
    dispatch => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetVideo: () => dispatch(VideoActions.resetVideo()),
      setVideo: (video: Video.IVideo) => dispatch(VideoActions.setVideo(video))
    })
  ),
  withProps((props: IConnectProps) => ({
    scoreWidth: Math.max(Math.min(props.viewportWidth, 1200), 200) - 30
  })),
  lifecycle<IMenuHandlerProps, {}>({
    componentWillMount() {
      $('body').addClass('no-scroll');
    },
    async componentDidMount() {
      if (this.props.viewportType === 'MOBILE') {
        this.props.setFretboardVisibility(false);
      }

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
    }
  })
);

const Outer = styled('div')`
  width: 100%;
`;

/**
 * Sets layout for the NotationShow page and fetches the notation from the router.
 */
export const Show = enhance(props => (
  <Outer id="notation-show">
    <MaestroController
      bpm={props.notation.bpm}
      durationMs={props.notation.durationMs}
      deadTimeMs={props.notation.deadTimeMs}
    />
    <Overlap>
      <Layer zIndex={10}>
        <div>
          <ShowVideo />
          <Affix
            target={getNotationShowElement}
            offsetTop={2}
          >
            {props.fretboardVisibility ? <Fretboard /> : null}
            {props.pianoVisibility ? <Piano /> : null}
          </Affix>
        </div>
        <div>
          <Score dynamic={true} notation={props.notation} width={props.scoreWidth} />
        </div>
      </Layer>
      <Layer zIndex={11}>
        <Menu />
        <VideoControls />
      </Layer>
    </Overlap>
  </Outer>
));
