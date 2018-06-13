import * as React from 'react';
import { Store } from 'react-redux';

interface IRootProps {
  store: Store<{}>
}

const Root: React.SFC<IRootProps> = props => (
  <div>
    Root
  </div>
);

export default Root;