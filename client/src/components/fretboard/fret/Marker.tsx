import * as React from 'react';
import { compose } from 'recompose';

interface IProps {
  str: number;
  fret: number;
}

const enhance = compose<IProps, IProps>(

);

export const Marker = enhance(props => (
  <div>Marker</div>
));
