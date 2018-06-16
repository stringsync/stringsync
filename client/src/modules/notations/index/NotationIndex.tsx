import * as React from 'react';
import styled from 'react-emotion';
import { BackTop } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchAllNotations } from 'data';

const enhance = compose(
  connect(
    (state: StringSync.Store.IState) => ({
      notations: state.notations.index,
      viewportType: state.viewport.type
    }),
    dispatch => ({
      fetchAllNotations: () => fetchAllNotations()(dispatch)
    })
  )
);

const Outer = styled('div')`
  overflow-x: hidden;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 24px;
`;

export const NotationIndex: React.SFC = () => (
  <Outer>
    <BackTop />
  </Outer>
);