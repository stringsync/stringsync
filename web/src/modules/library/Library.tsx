import React from 'react';
import { compose } from '../../util';
import { Layouts, withLayout } from '../../hocs';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Library: React.FC<Props> = enhance(() => {
  return <div data-testid="library">Library</div>;
});

export default Library;
