import React from 'react';
import compose from '../../util/compose';
import { Layouts, withLayout } from '../../hocs';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Library: React.FC<Props> = enhance(() => {
  return <div>Library</div>;
});

export default Library;
