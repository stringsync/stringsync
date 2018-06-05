import React from 'react';
import $ from 'jquery';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { BEGINNING_OF_EPOCH } from 'constants';
import { Element as ScrollElement } from 'react-scroll';
import { Fretboard, Score, Piano, MaestroController, Overlap, Layer } from 'components';
import { NotationShowVideo, NotationShowControls, NotationShowMenu } from './';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { notationsActions, fetchAllNotations, videoActions } from 'data';
import { Vextab } from 'services';

const enhance = compose(
  connect(
    state => ({
      notationsIndex: state.notations.index,
      notation: state.notations.show
    }),
    dispatch => ({
      fetchAllNotations: () => dispatch(fetchAllNotations()),
      setNotation: notation => dispatch(notationsActions.notations.show.set(notation)),
      resetNotation: () => dispatch(notationsActions.notations.show.reset()),
      setVideo: (kind, src) => dispatch(videoActions.video.set(kind, src)),
      resetVideo: () => dispatch(videoActions.video.reset())
    })
  ),
  withState('menuCollapsed', 'setMenuCollapsed', true),
  withHandlers({
    handleMenuClick: props => () => {
      props.setMenuCollapsed(!props.menuCollapsed);
    }
  }),
  lifecycle({
    componentWillMount() {
      $('body').addClass('no-scroll');
    },
    async componentDidMount() {
      if (this.props.notationsIndex.fetchedAt === BEGINNING_OF_EPOCH) {
        await this.props.fetchAllNotations();
      }

      const notationId = parseInt(this.props.match.params.id, 10);
      const notation = find(this.props.notationsIndex.notations, (({ id }) => notationId === id));

      if (notation) {
        this.props.setNotation(notation);
        const { kind, src } = notation.relationships.video.attributes;
        this.props.setVideo(kind, src);
      } else {
        window.ss.message.error(`Notation #${notationId} was not found`);
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

const Mask = styled('div')`
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
              target={() => document.getElementById('notation-show')}
              offsetTop={2}
            >
              <Fretboard />
              <Piano />
            </Affix>
          </div>
          <div>
            <ScrollElement name="notation-show-tab" />
            <Score />
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
