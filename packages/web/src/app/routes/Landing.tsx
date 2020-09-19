import React from 'react';
import { compose } from '@stringsync/common';
import { withLayout, Layout } from '../../hocs';

const enhance = compose(withLayout(Layout.DEFAULT));

export const Landing: React.FC = enhance(() => {
  return <div data-testid="landing">Landing</div>;
});
