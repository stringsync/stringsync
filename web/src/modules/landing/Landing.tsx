import React from 'react';
import { compose } from '../../common';
import { withLayout, Layouts } from '../../hocs';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Landing: React.FC<Props> = enhance(() => {
  return <div data-testid="landing">Landing</div>;
});

export default Landing;
