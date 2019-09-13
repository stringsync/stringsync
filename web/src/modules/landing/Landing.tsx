import React from 'react';
import { isMobile as $isMobile } from '../../store/selectors';
import { useSelector } from 'react-redux';

interface Props {}

const Landing: React.FC<Props> = (props) => {
  const isMobile = useSelector($isMobile);
  const msg = isMobile ? 'mobile' : 'not mobile';
  return <div>{msg}</div>;
};

export default Landing;
