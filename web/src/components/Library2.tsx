import React from 'react';
import { Layout, withLayout } from '../hocs/withLayout';
import { compose } from '../util/compose';
import { IntersectionTrigger } from './IntersectionTrigger';

const enhance = compose(withLayout(Layout.DEFAULT));

export const Library2: React.FC = enhance(() => {
  return (
    <div data-testid="library">
      <IntersectionTrigger />
    </div>
  );
});

export default Library2;
