import * as React from 'react';
import { compose } from 'recompose';
import { Lane } from '../../../components/lane/Lane';

const enhance = compose(

);

export const NotationDashboard = enhance(props => (
  <Lane withTopMargin={true} withPadding={true}>
    NotationDashboard
  </Lane>
));
