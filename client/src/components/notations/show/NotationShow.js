import React from 'react';
import { Affix } from 'antd';
import styled from 'react-emotion';
import { NotationShowVideo } from './';
import { compose, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { notationsActions, fetchAllNotations } from 'data';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';
import { BEGINNING_OF_EPOCH } from 'constants';
import { find } from 'lodash';

const enhance = compose(
  connect(
    state => ({
      notationsIndex: state.notations.index,
      notation: state.notations.show
    }),
    dispatch => ({
      fetchAllNotations: () => dispatch(fetchAllNotations()),
      setNotation: notation => dispatch(notationsActions.notations.show.set(notation))
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
      } else {
        window.ss.message.error(`Notation #${notationId} was not found`);
      }
    }
  }),
);

const Outer = styled('div')`
  display: flex;
  flex-flow: column;
  overflow: hidden;
  width: 100%;
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
    <Top>
      <NotationShowVideo />
      <Affix
        target={() => document.getElementById('notation-show')}
        offsetTop={2}
      >
        Fretboard
        Piano
      </Affix>
    </Top>
    <Middle>
      ScrollElement
      Score
    </Middle>
    <Bottom>
      NotationControls
    </Bottom>
  </Outer>
));

export default NotationShow;
