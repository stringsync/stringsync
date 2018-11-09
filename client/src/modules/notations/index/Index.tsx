import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { ContentLane } from '../../../components/content-lane';
import { Grid } from './grid';

const enhance = compose(
  lifecycle({
    componentDidMount(): void {
      // fetch notations
    }
  })
);

export const Index = enhance(props => (
  <ContentLane withTopMargin={true}>
    <Grid />
  </ContentLane>
));
