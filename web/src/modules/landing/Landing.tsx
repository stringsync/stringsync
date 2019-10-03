import React from 'react';
import { isMobile as isMobileSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import compose from '../../util/compose';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Landing: React.FC<Props> = enhance(() => {
  const isMobile = useSelector(isMobileSelector);
  const msg = isMobile ? 'mobile' : 'not mobile';
  return <div>{msg}</div>;
});

export default Landing;
