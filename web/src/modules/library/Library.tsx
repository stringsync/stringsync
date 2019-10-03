import React from 'react';
import compose from '../../util/compose';
import { Layouts } from '../../hocs/with-layout/Layouts';
import { withLayout } from '../../hocs';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Library: React.FC<Props> = enhance(() => {
  return <div>Library</div>;
});

export default Library;
