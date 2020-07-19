import React from 'react';
import { compose } from '@stringsync/common';
import { Layout, withLayout } from '../../hocs';

interface Props {}

const enhance = compose(withLayout(Layout.DEFAULT));

const Library: React.FC<Props> = enhance(() => {
  return <div data-testid="library">Library</div>;
});

export default Library;
