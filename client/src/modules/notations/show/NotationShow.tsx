import * as React from 'react';
import * as $ from 'jquery';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Fretboard, Score, Piano, MaestroController, Overlap, Layer } from 'components';
import { NotationShowVideo, NotationShowControls, NotationShowMenu } from './';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { NotationsActions, fetchNotation, VideoActions } from 'data';
import { RouteComponentProps } from 'react-router-dom';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ViewportTypes } from 'data/viewport/getViewportType';

type OuterProps = RouteComponentProps<{ id: string }>;

interface IConnectProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  viewportType: ViewportTypes;
  fetchNotation: (id: number) => Notation.INotation;
  resetNotation: () => void;
  resetVideo: () => void;
  setVideo: (video: Video.IVideo) => void;
}

interface IScoreWidthProps extends IConnectProps {
  scoreWidth: number;
}

interface IMenuProps extends IScoreWidthProps {
  menuCollapsed: boolean;
  fretboardVisibility: boolean;
  pianoVisibility: boolean;
  setMenuCollapsed: (menuCollapsed: boolean) => void;
  setFretboardVisibility: (fretboardVisibility: boolean) => void;
  setPianoVisibility: (pianoVisibility: boolean) => void;
}

interface IMenuHandlerProps extends IMenuProps {
  handleMenuClick: (event: React.SyntheticEvent<HTMLElement>) => void;
  handleFretboardVisibilityChange: (event: CheckboxChangeEvent) => void;
  handlePianoVisibilityChange: (event: CheckboxChangeEvent) => void;
}

const getNotationShowElement = () => document.getElementById('notation-show');

const enhance = compose<IMenuHandlerProps, OuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      notation: state.notations.show,
      viewportType: state.viewport.type,
      viewportWidth: state.viewport.width
    }),
    dispatch => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetNotation: () => dispatch(NotationsActions.resetNotationShow()),
      resetVideo: () => dispatch(VideoActions.resetVideo()),
      setVideo: (video: Video.IVideo) => dispatch(VideoActions.setVideo(video))
    })
  ),
  withProps((props: IConnectProps) => ({
    scoreWidth: Math.max(Math.min(props.viewportWidth, 1200), 200) - 30
  })),
  withState('menuCollapsed', 'setMenuCollapsed', true),
  withState('fretboardVisibility', 'setFretboardVisibility', true),
  withState('pianoVisibility', 'setPianoVisibility', false),
  withHandlers({
    handleFretboardVisibilityChange: (props: IMenuProps) => (event: CheckboxChangeEvent) => {
      props.setFretboardVisibility(event.target.checked);
    },
    handleMenuClick: (props: IMenuProps) => () => {
      props.setMenuCollapsed(!props.menuCollapsed);
    },
    handlePianoVisibilityChange: (props: IMenuProps) => (event: CheckboxChangeEvent) => {
      props.setPianoVisibility(event.target.checked);
    },
  }),
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
        const notation = await this.props.fetchNotation(id);

        if (notation.video) {
          this.props.setVideo(notation.video);
        }
      } catch (error) {
        console.error(error);
        window.ss.message.error('Something went wrong');
        this.props.history.push('/');
      }
    },
    componentWillUnmount() {
      this.props.resetNotation();
      this.props.resetVideo();
      $('body').removeClass('no-scroll');
    }
  })
);

const Outer = styled('div')`
  width: 100%;
`;

interface IMaskProps {
  collapsed: boolean;
}

const Mask = styled('div')<IMaskProps>`
  background: black;
  opacity: 0.65;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  display: ${props => props.collapsed ? 'none' : 'block'};
`;

/**
 * Sets layout for the NotationShow page and fetches the notation from the router.
 */
export const NotationShow = enhance(props => (
  <Outer id="notation-show">
    <MaestroController
      bpm={props.notation.bpm}
      deadTimeMs={props.notation.deadTimeMs}
    />
    <Overlap>
      <Layer zIndex={10}>
        <div>
          <NotationShowVideo />
          <Affix
            target={getNotationShowElement}
            offsetTop={2}
          >
            {props.fretboardVisibility ? <Fretboard /> : null}
            {props.pianoVisibility ? <Piano /> : null}
          </Affix>
        </div>
        <div>
          <Score
            vextabString={props.notation.vextabString}
            width={props.scoreWidth}
          />
        </div>
      </Layer>
      <Layer zIndex={11}>
        <Mask
          collapsed={props.menuCollapsed}
          onClick={props.handleMenuClick}
        />
        <NotationShowMenu
          fretboardVisibility={props.fretboardVisibility}
          pianoVisibility={props.pianoVisibility}
          onFretboardVisibilityChange={props.handleFretboardVisibilityChange}
          onPianoVisibilityChange={props.handlePianoVisibilityChange}
          collapsed={props.menuCollapsed}
        />
        <NotationShowControls
          menuCollapsed={props.menuCollapsed}
          onMenuClick={props.handleMenuClick}
        />
      </Layer>
    </Overlap>
  </Outer>
));
