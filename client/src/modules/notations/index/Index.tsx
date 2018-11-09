import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { ContentLane } from '../../../components/content-lane';
import { Grid } from './grid';
import { fetchAllNotations } from './fetchAllNotations';
import { connect } from 'react-redux';

const enhance = compose(
  connect(null, dispatch => ()),
  lifecycle({
    async componentDidMount() {
      const notations = await fetchAllNotations();
      
    }
  })
);

export const Index = enhance(props => (
  <ContentLane withTopMargin={true}>
    <Grid />
  </ContentLane>
));
