import React from 'react';
import { Affix } from 'antd';
import styled from 'react-emotion';
import { NotationShowVideo } from './';
import { compose, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { notationsActions } from 'data';
import { indexIncludedObjects, camelCaseKeys } from 'utilities';

const enhance = compose(
  connect(
    null,
    dispatch => ({
      setNotation: notation => dispatch(notationsActions.notations.show.set(notation))
    })
  )
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
