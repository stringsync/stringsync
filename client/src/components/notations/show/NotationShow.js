import React from 'react';
import styled from 'react-emotion';
import { Affix } from 'antd';
import { BEGINNING_OF_EPOCH } from 'constants';
import { Fretboard, Score, Piano, MaestroController } from 'components';
import { NotationShowVideo, NotationShowControls } from './';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { notationsActions, fetchAllNotations, videoActions } from 'data';
import { Element as ScrollElement } from 'react-scroll';

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
  lifecycle({
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
    }
  }),
);

const Outer = styled('div')`
  display: flex;
  flex-flow: column;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const Top = styled('div')`
`;

const Middle = styled('div')`
`;

const Bottom = styled('div')`
`;

/**
 * Sets layout for the NotationShow page and fetches the notation from the router.
 */
const NotationShow = enhance(props => (
  <Outer id="notation-show">
    <MaestroController
      bpm={props.notation.bpm}
      deadTimeMs={props.notation.deadTimeMs}
    />
    <Top>
      <NotationShowVideo />
      <Affix
        target={() => document.getElementById('notation-show')}
        offsetTop={2}
      >
        <Fretboard />
        <Piano />
      </Affix>
    </Top>
    <Middle>
      <ScrollElement name="notation-show-tab" />
      <Score />
    </Middle>
    <Bottom>
      <NotationShowControls />
    </Bottom>
  </Outer>
));

export default NotationShow;
