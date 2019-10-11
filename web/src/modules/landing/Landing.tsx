import React, { useState } from 'react';
import { isMobile as isMobileSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import compose from '../../util/compose';
import { withLayout } from '../../hocs';
import { Layouts } from '../../hocs/with-layout/Layouts';
import { PartialUser } from 'common/types';

interface Props {}

const enhance = compose(withLayout(Layouts.DEFAULT));

const Landing: React.FC<Props> = enhance(() => {
  return <div>Landing</div>;
});

export default Landing;
