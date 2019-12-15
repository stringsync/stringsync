import React from 'react';
import compose from '../../util/compose';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Landing: React.FC<Props> = enhance(() => {
  return <div data-testid="landing">Landing</div>;
});

export default Landing;
