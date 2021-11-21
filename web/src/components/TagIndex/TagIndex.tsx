import React from 'react';
import { Layout, withLayout } from '../../hocs/withLayout';
import { compose } from '../../util/compose';

const enhance = compose(withLayout(Layout.DEFAULT));

export const TagIndex = enhance(() => {
  return <div>tags</div>;
});

export default TagIndex;
