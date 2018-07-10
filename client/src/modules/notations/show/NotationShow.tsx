import * as React from 'react';
import * as $ from 'jquery';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Element as ScrollElement } from 'react-scroll';
import { Fretboard, Score, Piano, MaestroController, Overlap, Layer } from 'components';
import { NotationShowVideo, NotationShowControls, NotationShowMenu } from './';
import { compose, lifecycle, withState, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { NotationsActions, fetchNotation, VideoActions } from 'data';
import { Vextab } from 'models';
import { RouteComponentProps } from 'react-router-dom';

type OuterProps = RouteComponentProps<{ id: string }>;

interface IConnectProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  fetchNotation: (id: number) => Notation.INotation;
  resetNotation: () => void;
  resetVideo: () => void;
  setVideo: (video: Video.IVideo) => void;
}

interface IScoreWidthProps extends IConnectProps {
  scoreWidth: number;
}

interface IMenuCollapsedProps extends IScoreWidthProps {
  menuCollapsed: boolean;
  setMenuCollapsed: (menuCollapsed: boolean) => void;
}

interface IMenuHandlerProps extends IMenuCollapsedProps {
  handleMenuClick: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const getNotationShowElement = () => document.getElementById('notation-show');

const enhance = compose<IMenuHandlerProps, OuterProps>(
  connect(
    (state: StringSync.Store.IState) => ({
      notation: state.notations.show,
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
  withHandlers({
    handleMenuClick: (props: any) => () => {
      props.setMenuCollapsed(!props.menuCollapsed);
    }
  }),
  lifecycle<IMenuHandlerProps, {}>({
    componentWillMount() {
      $('body').addClass('no-scroll');
    },
    async componentDidMount() {
      const id = parseInt(this.props.match.params.id, 10);

      try {
        const notation = await this.props.fetchNotation(id);

        if (notation.video) {
          this.props.setVideo(notation.video);
        }
      } catch (error) {
        console.error(error);
        window.ss.message.error(`Notation #${id} was not found`);
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

const ContentContainer = styled('div')`
  display: flex;
  flex-flow: column;
  overflow: hidden;
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
    <Overlap>
      <Layer zIndex={10}>
        <ContentContainer>
          <MaestroController
            bpm={props.notation.bpm}
            deadTimeMs={props.notation.deadTimeMs}
          />
          <div>
            <NotationShowVideo />
            <Affix
              target={getNotationShowElement}
              offsetTop={2}
            >
              <Fretboard />
              <Piano />
            </Affix>
          </div>
          <div>
            <Score
              vextabString={props.notation.vextabString}
              width={props.scoreWidth}
            />
          </div>
        </ContentContainer>
      </Layer>
      <Layer zIndex={11}>
        <Mask
          collapsed={props.menuCollapsed}
          onClick={props.handleMenuClick}
        />
        <NotationShowMenu collapsed={props.menuCollapsed} />
        <NotationShowControls
          menuCollapsed={props.menuCollapsed}
          onMenuClick={props.handleMenuClick}
        />
      </Layer>
    </Overlap>
  </Outer>
));
