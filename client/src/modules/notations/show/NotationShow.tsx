import * as React from 'react';
import * as $ from 'jquery';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { Element as ScrollElement } from 'react-scroll';
import { Fretboard, Score, Piano, MaestroController, Overlap, Layer } from 'components';
import { NotationShowVideo, NotationShowControls, NotationShowMenu } from './';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { NotationsActions, fetchNotation, VideoActions } from 'data';
import { Vextab } from 'models';

interface IInnerProps {
  notation: Notation.INotation;
  menuCollapsed: boolean;
  fetchNotation: (id: number) => Notation.INotation;
  resetNotation: () => void;
  resetVideo: () => void;
  setVideo: (kind: Video.Kinds, src: string) => void;
  setMenuCollapsed: (menuCollapsed: boolean) => void;
  handleMenuClick: (event: React.SyntheticEvent<HTMLElement>) => void;
}

const getNotationShowElement = () => document.getElementById('notation-show');

const enhance = compose<IInnerProps, any>(
  connect(
    (state: StringSync.Store.IState) => ({
      notation: state.notations.show
    }),
    dispatch => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetNotation: () => dispatch(NotationsActions.resetNotationShow()),
      resetVideo: () => dispatch(VideoActions.resetVideo()),
      setVideo: (kind: Video.Kinds, src: string) => dispatch(VideoActions.setVideo(kind, src))
    })
  ),
  withState('menuCollapsed', 'setMenuCollapsed', true),
  withHandlers({
    handleMenuClick: (props: any) => (event: React.SyntheticEvent<HTMLElement>) => {
      props.setMenuCollapsed(!props.menuCollapsed);
    }
  }),
  lifecycle<any, any>({
    componentWillMount() {
      $('body').addClass('no-scroll');
    },
    async componentDidMount() {
      const id = parseInt(this.props.match.params.id, 10);

      try {
        const notation = await this.props.fetchNotation(id);
        const { kind, src } = notation.video;
        this.props.setVideo(kind, src);
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
const NotationShow = enhance(props => (
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
            <ScrollElement name="notation-show-tab" />
            <Score
              vextabString={props.notation.vextabString}
              measuresPerLine={4}
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

export default NotationShow;
