import * as React from 'react';
import { compose } from 'recompose';

const enhance = compose(

);

export const Bar = enhance(() => (
  <div>foo</div>
));
