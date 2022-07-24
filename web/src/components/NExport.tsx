import React from 'react';
import { Layout, withLayout } from '../hocs/withLayout';
import { compose } from '../util/compose';

const enhance = compose(withLayout(Layout.DEFAULT));

export const NExport: React.FC = enhance(() => {
  return <div>NExport</div>;
});

export default NExport;
