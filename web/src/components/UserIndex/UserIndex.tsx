import React from 'react';
import { Layout, withLayout } from '../../hocs/withLayout';
import { compose } from '../../util/compose';

const enhance = compose(withLayout(Layout.DEFAULT));

export const UserIndex: React.FC = enhance(() => {
  return <div>user index</div>;
});

export default UserIndex;
