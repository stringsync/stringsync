import * as React from 'react';
import { compose } from 'recompose';
import { ContentLane } from '../../../components/content-lane';
import styled from 'react-emotion';

const enhance = compose(

);

export const Index = enhance(props => (
  <ContentLane withTopMargin={true}>
    foo bar
  </ContentLane>
));
